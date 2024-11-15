use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use tauri::Emitter;
use regex::Regex;

#[derive(Clone, serde::Serialize)]
struct ScanProgress {
    progress: String,
    message: String,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn start_scan(app_handle: tauri::AppHandle, script: String) -> Result<String, String> {
    let args: Vec<String> = script
        .split_whitespace()
        .map(|s| s.to_string())
        .collect();

    let mut command = Command::new("nmap");
    command.args(["--stats-every", "2s", "-v"]); // Update interval and verbosity
    command.args(&args);
    command.stdout(Stdio::piped());
    command.stderr(Stdio::piped());

    let mut child = command.spawn().map_err(|e| format!("Failed to start nmap: {}", e))?;    
    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
    
    let app_handle_clone = app_handle.clone();
    
    // Create a regex to extract progress percentage
    let re = Regex::new(r"(\d+(\.\d+)?)% done").unwrap(); // Matches "65.3% done"
    let completion_re = Regex::new(r"Scan completed successfully").unwrap(); // Matches the completion message
    
    // Spawn a thread to process stdout
    std::thread::spawn(move || {
        let reader = BufReader::new(stdout);

        for line in reader.lines() {
            if let Ok(line) = line {
                // Check for scan completion message
                if completion_re.is_match(&line) {
                    // Emit 100% progress when scan is completed
                    let event_payload = ScanProgress {
                        progress: "100".to_string(),
                        message: "Scan completed successfully".to_string(),
                    };
                    _ = app_handle_clone.emit("scan-progress", event_payload);
                    break; // Exit the loop once the scan is complete
                }

                // Check if the line matches the progress pattern
                if let Some(caps) = re.captures(&line) {
                    if let Some(percentage) = caps.get(1) {
                        let progress = percentage.as_str().to_string();

                        // Force progress to 100% if it reaches 99.65% or above
                        let final_progress = if progress.parse::<f64>().unwrap_or(0.0) >= 99.65 {
                            "100".to_string()
                        } else {
                            progress
                        };
                        
                        let event_payload = ScanProgress {
                            progress: final_progress,
                            message: line.clone(),
                        };

                        // Emit progress update
                        _ = app_handle_clone.emit("scan-progress", event_payload);
                    }
                }
            }
        }
    });

    // Wait for the child process to finish
    match child.wait() {
        Ok(status) => {
            if status.success() {
                Ok("Scan completed successfully".to_string())
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
        .invoke_handler(tauri::generate_handler![greet, start_scan])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
