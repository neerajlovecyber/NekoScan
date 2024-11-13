import  { useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export function Settings() {
  const [isUpdating, setIsUpdating] = useState(false); // State to track update process
  const [updateStatus, setUpdateStatus] = useState<string>(""); // Store update status

  // Function to check and install updates
  const handleCheckForUpdates = async () => {
    setIsUpdating(true);
    setUpdateStatus("Checking for updates...");

    try {
      // Check for available updates
      const update = await check();
      if (update) {
        console.log(
          `Found update ${update.version} from ${update.date} with notes ${update.body}`
        );
        setUpdateStatus(`Found update: ${update.version}. Downloading...`);

        let downloaded = 0;
        let contentLength = 0;

        // Download and install the update
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              contentLength = event.data.contentLength;
              console.log(`Started downloading ${contentLength} bytes`);
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              console.log(`Downloaded ${downloaded} of ${contentLength}`);
              break;
            case "Finished":
              console.log("Download finished");
              break;
          }
        });

        setUpdateStatus("Update installed successfully. Restarting...");
        await relaunch();
      } else {
        setUpdateStatus("No updates available.");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      setUpdateStatus("Error checking for updates.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Settings</h1>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleCheckForUpdates}
            disabled={isUpdating}
          >
            {isUpdating ? "Checking..." : "Check for Updates"}
          </button>
        </div>
        <div className="mt-4">
          <p>{updateStatus}</p>
        </div>
      </div>
    </div>
  );
}
