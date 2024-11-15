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
    await db.execute("CREATE TABLE IF NOT EXISTS scans (id INTEGER PRIMARY KEY, name TEXT, target TEXT, profile TEXT, time_started TEXT, progress TEXT)");
    toast.success("Database connection is working!");
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
  }, []);

  const handleScanStart = async () => {
    try {
      const currentTime = new Date().toLocaleString();
      await db.execute(
        "INSERT INTO scans (name, target, profile, time_started, progress) VALUES (?, ?, ?, ?, ?)",
        [scanName, target, value, currentTime, "0%"]
      );

      toast.success(`Scan initiated for ${scanName} on ${target}`, {
        description: `Profile: ${value}`,
        action: {
          label: "Cancel Scan",
          onClick: () => console.log("Scan cancelled"),
        },
      });

      const unlisten = await listen("scan-progress", (event) => {
        const { progress, message } = event.payload;
        setScanProgress(progress || "0%");
        console.log(`Progress: ${progress}, Message: ${message}`);

        // If scan is completed, mark it as finished
        if (message.includes("Scan completed successfully")) {
          setScanCompleted(true);
          setScanProgress("100%"); // Ensure progress shows 100% when done
        }
      });

      const result = await invoke("start_scan", { script: command });

      console.log("Scan result:", result);
      if (!scanCompleted) {
        toast.success("Scan completed successfully!");
      }

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
