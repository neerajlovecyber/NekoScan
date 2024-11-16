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
        progress TEXT,
        status TEXT DEFAULT 'running'
      );
    `);
    
    console.log("Database initialized successfully.");
    
  } catch (error) {
    console.error("Failed to initialize database:", error);
    toast.error("Database initialization failed.");
  }
}

function ActiveScanCard({ scanId, scanInfo }) {
  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">{scanInfo.name || scanId}</div>
        <div className="text-sm text-muted-foreground">{scanInfo.progress}</div>
      </div>
      <div className="text-sm text-muted-foreground mb-2">
        Target: {scanInfo.target}
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: scanInfo.progress }}
        />
      </div>
      <div className="text-xs text-muted-foreground mt-2">{scanInfo.message}</div>
    </div>
  );
}

function ActiveScans({ activeScans }) {
  if (activeScans.size === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Active Scans</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from(activeScans).map(([scanId, scanInfo]) => (
          <ActiveScanCard key={scanId} scanId={scanId} scanInfo={scanInfo} />
        ))}
      </div>
    </div>
  );
}

export function NewScan() {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState("");
  const [target, setTarget] = useState("");
  const [scanName, setScanName] = useState("");
  const [activeScans, setActiveScans] = useState(new Map());

  const command = `nmap ${value} ${target}`;

  useEffect(() => {
    let unsubscribe;
    
    const setupListener = async () => {
      unsubscribe = await listen("scan-progress", async (event) => {
        const { scan_id: progressId, progress, message } = event.payload;
  
        let transactionStarted = false;
        
        try {
          const progressPercentage = `${progress}%`;
          
          setActiveScans(prev => {
            const updated = new Map(prev);
            const currentScan = updated.get(progressId) || {};
            updated.set(progressId, {
              ...currentScan,
              progress: progressPercentage,
              message,
            });
            return updated;
          });
  
          console.log("Updating database with progress for scan", progressId, progressPercentage);
  
          // Start a new transaction only if one is not already started
          await db.execute('BEGIN TRANSACTION');
          transactionStarted = true;
          
          // Execute the update in the database
          const updateResult = await db.execute(
            "UPDATE scans SET progress = ?, status = ? WHERE id = ?",
            [progressPercentage, progress === "100" ? "completed" : "running", progressId]
          );
          
          console.log(`Database update result for scan ${progressId}:`, updateResult);
  
          // Fetch the updated scan to verify the progress was updated
          const updatedScan = await db.select("SELECT * FROM scans WHERE id = ?", [progressId]);
          console.log("Updated scan from DB:", updatedScan);
  
          // Commit the transaction
          await db.execute('COMMIT');
          
          // If scan is completed, remove from active scans and show success toast
          if (progress === "100") {
            toast.success(`Scan ${progressId} completed`);
            setActiveScans(prev => {
              const updated = new Map(prev);
              updated.delete(progressId);
              return updated;
            });
          }
        } catch (error) {
          console.error("Failed to update scan progress:", error);
          toast.error(`Failed to update progress for scan ${progressId}`);
          
          // If the transaction was started, roll it back
          if (transactionStarted) {
            await db.execute('ROLLBACK');
          }
        }
      });
    };
  
    setupListener();
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  

  const loadExistingScans = async () => {
    try {
      const runningScans = await db.select(
        "SELECT * FROM scans WHERE status = 'running'"
      );
      
      const scansMap = new Map();
      runningScans.forEach(scan => {
        scansMap.set(scan.id, {
          name: scan.name,
          target: scan.target,
          progress: scan.progress,
          message: "Scan in progress...",
        });
      });
      
      setActiveScans(scansMap);
    } catch (error) {
      console.error("Failed to load existing scans:", error);
    }
  };

  const handleScanStart = async () => {
    if (!target.trim() || !value || !scanName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const scan_id = await invoke("start_scan", { script: command });
      const startTime = new Date().toLocaleString();

      setActiveScans(prev => {
        const updated = new Map(prev);
        updated.set(scan_id, {
          name: scanName,
          target: target,
          progress: "0%",
          message: "Starting scan...",
        });
        return updated;
      });

      await db.execute(
        "INSERT INTO scans (id, name, target, profile, time_started, progress, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [scan_id, scanName, target, value, startTime, "0%", "running"]
      );
      
      toast.success(`Scan initiated: ${scanName} targeting ${target}`);
      
      // Reset form and close dialog
      setScanName("");
      setTarget("");
      setValue("");
      setDialogOpen(false);
      

    } catch (error) {
      console.error("Scan initiation failed:", error);
      toast.error("Failed to start the scan");
    }
  };

  return (
    <div className="space-y-6">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="animate-buttonheartbeat rounded-md py-1 text-sm font-semibold text-white inline-flex">
            <Search className="mr-2 h-4 w-4" /> New Scan
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
                value={scanName} 
                onChange={(e) => setScanName(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter scan name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">Target</Label>
              <Input 
                id="target" 
                value={target} 
                onChange={(e) => setTarget(e.target.value)} 
                className="col-span-3" 
                placeholder="Enter target IP or hostname"
              />
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
                          <CommandItem 
                            key={profile.value} 
                            value={profile.value} 
                            onSelect={() => {
                              setValue(profile.value);
                              setOpen(false);
                            }}
                          >
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
              <div className="bg-secondary p-2 rounded text-foreground col-span-3">
                <code>{command}</code>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleScanStart} 
              className="bg-primary hover:bg-primary/90"
            >
              Start Scan
            </Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}