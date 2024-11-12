import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Command } from '@tauri-apps/plugin-shell';
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming you have this component

interface ScriptsTabProps {
  setScriptsOptions: (options: string) => void;  // Prop to set the scripts in the parent component
}

export function ScriptsTab({ setScriptsOptions }: ScriptsTabProps) {
  const [scripts, setScripts] = useState<string[]>([]);
  const [selectedScript, setSelectedScript] = useState<{ description: string, usage: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedScripts, setSelectedScripts] = useState<Set<string>>(new Set()); // Track selected scripts

  // Function to fetch scripts from the Nmap scripts folder
  const fetchScripts = async () => {
    try {
      // Determine the command based on the user's OS
      const isWindows = navigator.userAgent.includes("Windows");
      const command = isWindows ? 'cmd' : 'sh';
      const args = isWindows 
        ? ['/C', 'Get-ChildItem -Path "C:\\Program Files (x86)\\Nmap\\scripts\\" -File | Select-Object -ExpandProperty Name']  // Windows: bare file list
        : ['-c', 'ls -1 src/nmap/scripts'];  // Unix-based systems

      // Execute the shell command to list files in the Nmap scripts folder
      let result = await Command.create(command, args).execute();
      console.log("Shell command result:", result.stderr)
      if (result.stdout) {
        // Split the result into an array of script names
        const scriptList = result.stdout.split("\n").filter(line => line.trim() !== "");
        if (scriptList.length > 0) {
          setScripts(scriptList);
          setError(null); // Reset error on success
        } else {
          setError("No scripts found in the specified directory.");
        }
      } else {
        setError("No output or error occurred while fetching scripts.");
      }
    } catch (error) {
      console.error("Error fetching scripts:", error);
      setError("Failed to fetch scripts. Please check if Nmap is installed correctly and accessible.");
    }
  };

  // Run fetchScripts on component mount
  useEffect(() => {
    fetchScripts();
  }, []);

  // Load selected scripts from localStorage on mount
  useEffect(() => {
    const savedScripts = localStorage.getItem("selectedScripts");
    if (savedScripts) {
      setSelectedScripts(new Set(savedScripts.split(",")));
    }
  }, []);

  // Function to handle checkbox selection
  const handleCheckboxChange = (scriptName: string, checked: boolean) => {
    setSelectedScripts((prevSelectedScripts) => {
      const newSelectedScripts = new Set(prevSelectedScripts);
      if (checked) {
        newSelectedScripts.add(scriptName);  // Add the script if checked
      } else {
        newSelectedScripts.delete(scriptName);  // Remove the script if unchecked
      }

      // Only prepend "--script=" once and join the scripts with commas, removing any extra spaces
      const scriptsWithPrefix = `--script=${Array.from(newSelectedScripts)
        .map(script => script.trim())  // Remove any extra spaces from script names
        .join(",")}`; // Only one "--script=" for all selected scripts

      // Update the parent component with the selected scripts
      setScriptsOptions(scriptsWithPrefix);

      // Save the selected scripts to localStorage
      localStorage.setItem("selectedScripts", Array.from(newSelectedScripts).join(","));
      
      return newSelectedScripts;
    });
  };

  return (
    <div className="flex gap-4">
      {/* Left Column (Script List) */}
      <Card className="w-[30%] bg-gray-800 p-4 rounded-lg text-white">
        <CardContent>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Scripts</h4>
                <ul className="space-y-2">
                  {scripts.length > 0 ? (
                    scripts.map((script, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                        <input
                          type="checkbox"
                          checked={selectedScripts.has(script)}  // Check if this script is selected
                          onChange={(e) => handleCheckboxChange(script, e.target.checked)}  // Handle checkbox change
                        />
                        {script}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-600">No scripts available.</p>
                  )}
                </ul>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Right Column (Script Description and Usage) */}
      <Card className="w-[70%] bg-gray-800 p-4 rounded-lg text-white">
        <CardContent>
          {selectedScript ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Description</h3>
                <p className="text-gray-600">{selectedScript.description}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Usage:</h4>
                <pre className="bg-gray-800 text-white p-2 rounded-md">
                  {selectedScript.usage}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Select a script to see its description and usage.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
