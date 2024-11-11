import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
"use client"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const profiles = [
  { value: "-T4", label: "Fast Scan" },
  { value: "-T2", label: "Slow Scan" },
  { value: "-T5 -A", label: "Intensive Scan" },
  { value: "-sS", label: "Full TCP scan" },
];

export function NewScan() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [target, setTarget] = React.useState(""); // State for target input

  // Generate command based on profile and target
  const command = `nmap ${value} ${target}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Search /> New Scan</Button>
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
            <Input id="name" placeholder="Name of the scan" className="col-span-3" />
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
                  className="w-[200px] justify-between"
                >
                  {value
                    ? profiles.find((profile) => profile.value === value)?.label
                    : "Select profile..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
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
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/* Display the command to be executed */}
          <div className="mt-4">
            <Label className="text-left">Command Preview:</Label>
            <div className="bg-gray-800 p-2 rounded">
              <code>{command}</code>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              toast("Scan has been initialized", {
                description: `Target: ${target} - Profile: ${value}`,
                action: {
                  label: "Cancel Scan",
                  onClick: () => console.log("Scan cancelled"),
                },
              })
            }
          >
            Start Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
