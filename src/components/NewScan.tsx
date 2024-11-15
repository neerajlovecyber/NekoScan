import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command as UICommand, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Database from "@tauri-apps/plugin-sql";
import { useEffect } from "react";
import { Command } from '@tauri-apps/plugin-shell';
const profiles = [
  { value: "-T4", label: "Fast Scan" },
  { value: "-T2", label: "Slow Scan" },
  { value: "-T5 -A -T5 -A -T5 -A", label: "Intensive Scan" },
  { value: "-sS", label: "Full TCP scan" },
];

// Load the database
const db = await Database.load("sqlite:test.db");

// Function to check if the database connection is working
async function checkDatabase() {
  try {
    await db.execute("CREATE TABLE IF NOT EXISTS scans (id INTEGER PRIMARY KEY, name TEXT, target TEXT, profile TEXT, time_started TEXT, progress TEXT)");
    toast.success("Database connection is working!");
  } catch (error) {
    console.error("Database connection failed:", error);
    toast.error("Database connection failed. Check the console for details.");
  }
}

// Function to run the scan command and return its output, including real-time progress
const Scan = async (script: string, setScanProgress: React.Dispatch<React.SetStateAction<string>>) => {
  try {
    const isWindows = navigator.userAgent.includes("Windows");
    const command = isWindows ? 'cmd' : 'sh';
    const args = isWindows
      ? ['/C', `nmap --stats-every 2s -v ${script}`] // Add --stats-every 2s
      : ['-c', `nmap --stats-every 2s -v ${script}`]; // Add --stats-every 2s

    // Execute the command
    const result = await Command.create(command, args).execute();

    // Split the output by lines and look for percentage matches
    const output = result.stdout; // Assuming result.stdout contains the full output as a string

    const outputLines = output.split("\n");
    outputLines.forEach((line) => {
      const match = line.match(/(\d+)% done/);  // Look for percentage match in the output
      if (match) {
        const progress = match[1];
        console.log(`Scan progress: ${progress}%`) // Log progress
        setScanProgress(`${progress}%`); // Update progress
      }
    });

    return result.stdout; // Return full scan result if needed
  } catch (error) {
    console.error("Scan execution failed:", error);
    toast.error("Scan execution failed");
  }
};

export function NewScan() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [target, setTarget] = React.useState(""); // State for target input
  const [scanName, setScanName] = React.useState(""); // State for scan name
  const [scanProgress, setScanProgress] = React.useState("0%"); // State for scan progress

  // Generate command based on profile and target
  const command = `nmap ${value} ${target}`;

  // Check the database connection when the component mounts
  useEffect(() => {
    checkDatabase();
  }, []);

  // Handle the scan start
  const handleScanStart = async () => {
    try {
      // Add scan details to the database (initial progress set to "0%")
      const currentTime = new Date().toLocaleString();
      await db.execute(
        "INSERT INTO scans (name, target, profile, time_started, progress) VALUES (?, ?, ?, ?, ?)",
        [scanName, target, value, currentTime, scanProgress]
      );

      // Show a toast notification for scan initiation
      toast.success(`Scan initiated for ${scanName} on ${target}`, {
        description: `Profile: ${value}`,
        action: {
          label: "Cancel Scan",
          onClick: () => console.log("Scan cancelled"),
        },
      });

      // Execute the scan and track the progress
      const scanResult = await Scan(command, setScanProgress);

      console.log("Scan output:", scanResult); // Log the scan result

    } catch (error) {
      console.error("Error starting scan:", error);
      toast.error("Scan initiation failed. Check the console for details.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  className=" animate-buttonheartbeat rounded-md py-1 text-sm font-semibold text-white inline-flex">
          <Search /> New Scan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a new scan</DialogTitle>
          <DialogDescription>
            Make changes to your Scan Settings here. Click Start Scanning when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Name of the scan"
              value={scanName}
              onChange={(e) => setScanName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              Target
            </Label>
            <Input
              id="target"
              placeholder="Enter IP or IP range"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile" className="text-right">
              Profile
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between col-span-3"
                >
                  {value
                    ? profiles.find((profile) => profile.value === value)?.label
                    : "Select profile..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <UICommand>
                  <CommandInput placeholder="Search profile..." />
                  <CommandList>
                    <CommandEmpty>No profile found.</CommandEmpty>
                    <CommandGroup>
                      {profiles.map((profile) => (
                        <CommandItem
                          key={profile.value}
                          value={profile.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === profile.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {profile.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </UICommand>
              </PopoverContent>
            </Popover>
          </div>
          {/* Display the command to be executed */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Command
            </Label>
            <div className="bg-gray-800 p-2 rounded text-white col-span-3">
              <code>{command}</code>
            </div>
          </div>

          {/* Display the scan progress */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Progress</Label>
            <div className="bg-gray-800 p-2 rounded text-white col-span-3">
              <code>{scanProgress}</code>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline"  className="animate-buttonheartbeat rounded-md py-1 text-sm font-semibold text-white inline-flex" onClick={handleScanStart}>
            Start Scan
          </Button>
          
  

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
