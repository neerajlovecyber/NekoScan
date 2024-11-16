use tauri::Emitter;
use regex::Regex;
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use uuid::Uuid;

#[derive(Clone, serde::Serialize)]
struct ScanProgress {
    scan_id: String,
    progress: String,
    message: String,
}

#[tauri::command]
async fn start_scan(app_handle: tauri::AppHandle, script: String) -> Result<String, String> {
    // Generate a unique scan_id using UUID
    let scan_id = Uuid::new_v4().to_string(); // Generate a unique scan ID

    let args: Vec<String> = script.split_whitespace().map(|s| s.to_string()).collect();

    let mut command = Command::new("nmap");
    command.args(["--stats-every", "1s", "-v"]);
    command.args(&args);
    command.stdout(Stdio::piped());
    command.stderr(Stdio::piped());

    let mut child = command.spawn().map_err(|e| format!("Failed to start nmap: {}", e))?;
    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;

    // Clone scan_id before moving it into the closure
    let scan_id_clone = scan_id.clone(); // This ensures you can use scan_id after moving it

    let app_handle_clone = app_handle.clone();
    let progress_re = Regex::new(r"(\d+(\.\d+)?)% done").unwrap(); // Regex for progress updates
    let done_re = Regex::new(r"Nmap done").unwrap(); // Regex for scan completion

    // Spawn a new thread to monitor the output
    std::thread::spawn(move || {
        let reader = BufReader::new(stdout);

        for line in reader.lines() {
            if let Ok(line) = line {
                // Check for scan completion
                if done_re.is_match(&line) {
                    println!("Completion detected: Nmap done");
                    let event_payload = ScanProgress {
                        scan_id: scan_id_clone.clone(), // Use the cloned scan_id here
                        progress: "100".to_string(),
                        message: "Nmap done".to_string(),
                    };
                    _ = app_handle_clone.emit("scan-progress", event_payload);
                    break;
                }

                // Check for progress updates
                if let Some(caps) = progress_re.captures(&line) {
                    if let Some(percentage) = caps.get(1) {
                        let progress = percentage.as_str().to_string();
                        println!("Progress for Scan ID {}: {}%", scan_id_clone, progress);

                        let event_payload = ScanProgress {
                            scan_id: scan_id_clone.clone(), // Use the cloned scan_id here
                            progress,
                            message: line.clone(),
                        };

                        _ = app_handle_clone.emit("scan-progress", event_payload);
                    }
                }
            }
        }
    });

    // Wait for the nmap process to complete
    match child.wait() {
        Ok(status) => {
            if status.success() {
                // Return the scan_id on success
                Ok(scan_id) // Send back the scan_id to the frontend
            } else {
                Err(format!("Scan failed with status: {}", status))
            }
        }
        Err(e) => Err(format!("Failed to wait for scan completion: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            println!("Another instance tried to open with args: {:?} and cwd: {:?}", args, cwd);
        }))
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![start_scan]) // Add the command handler
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
