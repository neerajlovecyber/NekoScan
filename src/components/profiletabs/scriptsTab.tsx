import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { Command } from '@tauri-apps/plugin-shell';
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming you have this component

interface ScriptsTabProps {
  setScriptsOptions: (options: string) => void;  // Prop to set the scripts in the parent component
}

export function ScriptsTab({ setScriptsOptions }: ScriptsTabProps) {
  const [scripts, setScripts] = useState<string[]>([]);
  const [filteredScripts, setFilteredScripts] = useState<string[]>([]); // For storing filtered scripts based on search
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const [selectedScript, setSelectedScript] = useState<{ description: string, usage: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedScripts, setSelectedScripts] = useState<Set<string>>(new Set()); // Track selected scripts
  const [scrollHeight, setScrollHeight] = useState<number>(400); // Default height for the script list scroll area
  const descriptionRef = useRef<HTMLDivElement>(null); // Ref to track the description area height

  // Function to fetch scripts from the Nmap scripts folder
  const fetchScripts = async () => {
    try {
      const isWindows = navigator.userAgent.includes("Windows");
      const command = isWindows ? 'cmd' : 'sh';
      const args = isWindows
        ? ['/C', 'Get-ChildItem -Path "C:\\Program Files (x86)\\Nmap\\scripts\\" -File | Select-Object -ExpandProperty Name']
        : ['-c', 'ls -1 /usr/share/nmap/scripts'];  // Unix-based systems path

      const result = await Command.create(command, args).execute();
      console.log("Shell command result:", result.stderr);

      if (result.stdout) {
        const scriptList = result.stdout.split("\n").filter(line => line.trim() !== "");
        if (scriptList.length > 0) {
          setScripts(scriptList);
          setFilteredScripts(scriptList); // Set initial filtered scripts
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

  // Function to fetch the description and usage of a script
  const fetchScriptDescription = async (script: string) => {
    try {
      const isWindows = navigator.userAgent.includes("Windows");
      const command = isWindows ? 'cmd' : 'sh';
      const args = isWindows
        ? ['/C', `nmap --script-help ${script}`]
        : ['-c', `nmap --script-help ${script}`];  // Use nmap help to get script description
  
      const result = await Command.create(command, args).execute();
      console.log("Shell command result:", result.stdout);

      if (result.stdout) {
        // Set the full raw output of nmap, with the line breaks intact
        setSelectedScript({
          description: result.stdout, // Do not trim, keep line breaks
          usage: "", // You can leave this blank or adjust as needed
        });
      }
    } catch (error) {
      console.error("Error fetching description for script:", script, error);
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

  // Update the scroll height based on the description area height
  useEffect(() => {
    if (descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.clientHeight;
      const defaultHeight = 400; // Default height for the list

      // Set the height of the script list to match the description height, but not less than the default height
      setScrollHeight(Math.max(descriptionHeight, defaultHeight));
    }
  }, [selectedScript]); // Recalculate when the description changes

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
      const selectedScriptsArray = Array.from(newSelectedScripts).map(script => script.trim());
      if (selectedScriptsArray.length > 0) {
        const scriptsWithPrefix = `--script=${selectedScriptsArray.join(",")}`; // Only one "--script=" for all selected scripts
        setScriptsOptions(scriptsWithPrefix); // Update the parent component
      } else {
        setScriptsOptions(""); // Clear the option if no scripts are selected
      }

      // Save the selected scripts to localStorage
      localStorage.setItem("selectedScripts", selectedScriptsArray.join(","));
      
      return newSelectedScripts;
    });
  };

  // Function to handle script selection and display description
  const handleScriptClick = (scriptName: string) => {
    fetchScriptDescription(scriptName); // Fetch description when a script is clicked
  };

  // Function to filter scripts based on the search query
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredScripts(scripts); // If search is cleared, show all scripts
    } else {
      const filtered = scripts.filter(script => script.toLowerCase().includes(query));
      setFilteredScripts(filtered); // Filter scripts based on search query
    }
  };

  // Function to clear all selected scripts
  const handleClearSelection = () => {
    setSelectedScripts(new Set()); // Clear selected scripts
    setScriptsOptions(""); // Clear the selected options in the parent
    localStorage.removeItem("selectedScripts"); // Remove from localStorage
  };

  return (
    <div className="flex gap-4 w-full">
      {/* Left Column (Script List) */}
      <Card className="flex-shrink-0 w-[30%] bg-gray-800 p-4 rounded-lg text-white">
        <CardContent>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <div className="mb-4">
                {/* Search input */}
                <input
                  type="text"
                  placeholder="Search scripts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                />
              </div>
              <ScrollArea className="w-full" style={{ height: `${scrollHeight}px` }}>
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">Scripts</h4>
                  <ul className="space-y-2">
                    {filteredScripts.length > 0 ? (
                      filteredScripts.map((script, index) => (
                        <li key={index} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedScripts.has(script)}  // Check if this script is selected
                            onChange={(e) => handleCheckboxChange(script, e.target.checked)}  // Handle checkbox change
                          />
                          <button className="w-full text-left" onClick={() => handleScriptClick(script)}>{script}</button>
                        </li>
                      ))
                    ) : (
                      <p className="text-gray-600">No scripts available.</p>
                    )}
                  </ul>
                </div>
              </ScrollArea>
              {/* Clear Selection Button */}
              <button
                onClick={handleClearSelection}
                className="mt-4 w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Clear Selection
              </button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Right Column (Script Description and Usage) */}
      <Card className="flex-grow bg-gray-800 p-4 rounded-lg text-white">
        <CardContent>
          {selectedScript ? (
            <div ref={descriptionRef} className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Description</h3>
                {/* Render the description with proper line breaks */}
                <pre className="text-gray-600 whitespace-pre-wrap">{selectedScript.description}</pre>
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
