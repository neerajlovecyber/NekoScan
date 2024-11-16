import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Search } from "lucide-react";
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

async function initializeDatabase() {
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
    toast.success("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    toast.error("Database initialization failed.");
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
    initializeDatabase();

    const fetchScans = async () => {
      try {
        const results = await db.select("SELECT * FROM scans");
        console.log("Scans in database:", results);
      } catch (error) {
        console.error("Failed to fetch scans:", error);
      }
    };

    fetchScans();
  }, []);

  const handleScanStart = async () => {
    try {
      // Get the response object from the backend, which should include scan_id
      const response = await invoke("start_scan", { script: command });

      // Debugging: Log the full response to inspect it
      console.log("Full response:", response);

      // Extract the scan_id from the response object
      const scan_id = response;

      const startTime = new Date().toLocaleString();

      // Debugging: Log the extracted scan_id
      console.log("Extracted scan ID:", scan_id);

      // Check if the scan_id already exists in the database
      const existingScans = await db.select("SELECT id FROM scans WHERE id = ?", [scan_id]);
      if (existingScans.length > 0) {
        toast.error("Scan ID conflict: A scan with this ID already exists.");
        return;
      }

      // Insert the new scan into the database
      await db.execute(
        "INSERT INTO scans (id, name, target, profile, time_started, progress) VALUES (?, ?, ?, ?, ?, ?)",
        [scan_id, scanName, target, value, startTime, "0%"]
      );

      toast.success(`Scan initiated: ${scanName} targeting ${target}.`);

      // Listen for scan progress events
      const unlisten = await listen("scan-progress", async (event) => {
        const { scan_id: progressId, progress, message } = event.payload;
        if (progressId === scan_id) {
          setScanProgress(progress);
          console.log(`Scan Progress [${progressId}]: ${progress} - ${message}`);

          // Update the scan progress in the database
          await db.execute("UPDATE scans SET progress = ? WHERE id = ?", [progress, progressId]);

          if (progress === "100%") {
            setScanCompleted(true);
            toast.success(`Scan ${scanName} completed.`);
            // Update the database with completion status
            await db.execute("UPDATE scans SET progress = '100%' WHERE id = ?", [progressId]);
          }
        }
      });
    } catch (error) {
      console.error("Scan initiation failed:", error);
      toast.error("Failed to start the scan. See the console for details.");
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
            <Input id="name" value={scanName} onChange={(e) => setScanName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">Target</Label>
            <Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile" className="text-right">Profile</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between col-span-3">
                  {value ? profiles.find((p) => p.value === value)?.label : "Select profile..."}
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
                        <CommandItem key={profile.value} value={profile.value} onSelect={() => {
                          setValue(profile.value);
                          setOpen(false);
                        }}>
                          <Check className={value === profile.value ? "mr-2 opacity-100" : "mr-2 opacity-0"} />
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
            <div className="bg-gray-800 p-2 rounded text-white col-span-3"><code>{command}</code></div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Progress</Label>
            <div className="col-span-3 font-bold text-xl">{scanProgress}</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleScanStart} className="bg-teal-800 hover:bg-green-700" disabled={scanCompleted}>
            Start Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
