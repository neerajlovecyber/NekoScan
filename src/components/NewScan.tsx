import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command as UICommand, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Database from "@tauri-apps/plugin-sql";
import { listen } from "@tauri-apps/api/event";
import { invoke } from '@tauri-apps/api/core';

const profiles = [
  { value: "-T4", label: "Fast Scan" },
  { value: "-T2", label: "Slow Scan" },
  { value: "-T5 -A", label: "Intensive Scan" },
  { value: "-sS", label: "Full TCP scan" },
];

const db = await Database.load("sqlite:test.db");

async function checkDatabase() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        name TEXT,
        target TEXT,
        profile TEXT,
        time_started TEXT,
        progress TEXT
      );
    `);
    toast.success("Database connection is working!");
    console.log("output", await db.execute("SELECT name FROM scans"));
  } catch (error) {
    console.error("Database connection failed:", error);
    toast.error("Database connection failed. Check the console for details.");
  }
}

export function NewScan() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [target, setTarget] = useState("");
  const [scanName, setScanName] = useState("");
  const [scanProgress, setScanProgress] = useState("0%");
  const [scanCompleted, setScanCompleted] = useState(false);

  const command = `nmap ${value} ${target}`;

  useEffect(() => {
    checkDatabase();

    // Fetch scans from the database when the component mounts
    const fetchScans = async () => {
      try {
        const results = await db.select('SELECT * FROM scans');
        console.log('Scans in database:', results);
      } catch (error) {
        console.error('Error fetching scans:', error);
      }
    };

    fetchScans(); // Run once when the component mounts
  }, []); // Empty dependency array means this runs once on mount

  const handleScanStart = async () => {
    try {
      const scan_id = await invoke("start_scan", { script: command });
  
      // Insert the scan details into the database here
      console.log("Scan started with ID:", scan_id);  // Log the actual scan_id
      await db.execute(
        "INSERT INTO scans (id, name, target, profile, time_started, progress) VALUES (?, ?, ?, ?, ?, ?)",
        [scan_id, scanName, target, value, new Date().toLocaleString(), "0%"]
      );
  
      toast.success(`Scan initiated for ${scanName} on ${target}`, {
        description: `Profile: ${value}`,
        action: {
          label: "Cancel Scan",
          onClick: () => console.log("Scan cancelled"),
        },
      });
  
      // Mark the listener as async so we can use 'await' inside it
      const unlisten = await listen("scan-progress", async (event) => {  // Mark this as async
        const { scan_id: progress_scan_id, progress, message } = event.payload;  // Capture the scan_id in progress event
        if (progress_scan_id === scan_id) {  // Ensure this is the correct scan_id
          setScanProgress(progress || "0%");
          console.log(`Progress: ${progress}, Message: ${message}, Scan ID: ${progress_scan_id}`);  // Log the correct scan_id
  
          // Update the progress in the database
          await db.execute(
            "UPDATE scans SET progress = ? WHERE id = ?",
            [progress, progress_scan_id]  // Ensure you're using the correct scan_id
          );
        }
      });
  
      // Wait for the scan to complete
      const result = await invoke("start_scan", { script: command });
      console.log("Scan result:", result);
  
      // Mark the scan as completed in the database
      await db.execute(
        "UPDATE scans SET progress = '100%' WHERE id = ?",
        [scan_id]  // Use the same scan_id here
      );
  
      unlisten();
    } catch (error) {
      console.error("Error starting scan:", error);
      toast.error("Scan initiation failed. Check the console for details.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="animate-buttonheartbeat rounded-md py-1 text-sm font-semibold text-white inline-flex">
          <Search /> New Scan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a new scan</DialogTitle>
          <DialogDescription>Configure your scan and start it here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              placeholder="Name of the scan"
              value={scanName}
              onChange={(e) => setScanName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">Target</Label>
            <Input
              id="target"
              placeholder="Enter IP or IP range"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile" className="text-right">Profile</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between col-span-3">
                  {value
                    ? profiles.find((profile) => profile.value === value)?.label
                    : "Select profile..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <UICommand>
                  <CommandInput placeholder="Search profile..." />
                  <CommandList>
                    <CommandEmpty>No profile found.</CommandEmpty>
                    <CommandGroup>
                      {profiles.map((profile) => (
                        <CommandItem
                          key={profile.value}
                          value={profile.value}
                          onSelect={() => {
                            setValue(profile.value);
                            setOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2", value === profile.value ? "opacity-100" : "opacity-0")} />
                          {profile.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </UICommand>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Command</Label>
            <div className="bg-gray-800 p-2 rounded text-white col-span-3">
              <code>{command}</code>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Progress</Label>
            <div className="col-span-3 font-bold text-xl">{scanProgress}</div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleScanStart}
            className="bg-teal-800 hover:bg-green-700"
            disabled={scanCompleted}
          >
            Start Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
