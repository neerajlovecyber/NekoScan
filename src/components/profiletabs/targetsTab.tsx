import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function TargetsTab({ setTargetsOptions }) {
  const loadStateFromLocalStorage = () => {
    return {
      excludeHosts: JSON.parse(localStorage.getItem("excludeHosts") || "false"),
      exclusionFile: JSON.parse(localStorage.getItem("exclusionFile") || "false"),
      targetListFile: JSON.parse(localStorage.getItem("targetListFile") || "false"),
      scanRandomHosts: JSON.parse(localStorage.getItem("scanRandomHosts") || "false"),
      portsToScan: JSON.parse(localStorage.getItem("portsToScan") || "false"),
      fastScan: JSON.parse(localStorage.getItem("fastScan") || "false"),
    };
  };

  const [excludeHosts, setExcludeHosts] = useState(loadStateFromLocalStorage().excludeHosts);
  const [excludeHostsValue, setExcludeHostsValue] = useState("");
  const [exclusionFile, setExclusionFile] = useState(loadStateFromLocalStorage().exclusionFile);
  const [exclusionFileValue, setExclusionFileValue] = useState("");
  const [targetListFile, setTargetListFile] = useState(loadStateFromLocalStorage().targetListFile);
  const [targetListFileValue, setTargetListFileValue] = useState("");
  const [scanRandomHosts, setScanRandomHosts] = useState(loadStateFromLocalStorage().scanRandomHosts);
  const [scanRandomHostsValue, setScanRandomHostsValue] = useState("");
  const [portsToScan, setPortsToScan] = useState(loadStateFromLocalStorage().portsToScan);
  const [portsToScanValue, setPortsToScanValue] = useState("");
  const [fastScan, setFastScan] = useState(loadStateFromLocalStorage().fastScan);

  // Save the state to localStorage whenever any state changes
  useEffect(() => {
    localStorage.setItem("excludeHosts", JSON.stringify(excludeHosts));
    localStorage.setItem("exclusionFile", JSON.stringify(exclusionFile));
    localStorage.setItem("targetListFile", JSON.stringify(targetListFile));
    localStorage.setItem("scanRandomHosts", JSON.stringify(scanRandomHosts));
    localStorage.setItem("portsToScan", JSON.stringify(portsToScan));
    localStorage.setItem("fastScan", JSON.stringify(fastScan));
  }, [excludeHosts, exclusionFile, targetListFile, scanRandomHosts, portsToScan, fastScan]);

  // Update command options whenever relevant state changes
  useEffect(() => {
    const commandOptions = [];

    if (excludeHosts) commandOptions.push(`--exclude ${excludeHostsValue}`);
    if (exclusionFile) commandOptions.push(`--excludefile ${exclusionFileValue}`);
    if (targetListFile) commandOptions.push(`--targetlist ${targetListFileValue}`);
    if (scanRandomHosts) commandOptions.push(`--scanrandomhosts ${scanRandomHostsValue}`);
    if (portsToScan) commandOptions.push(`--ports ${portsToScanValue}`);
    if (fastScan) commandOptions.push(`--fast`);

    setTargetsOptions(commandOptions.join(" ").trim());
  }, [excludeHosts, excludeHostsValue, exclusionFile, exclusionFileValue, targetListFile, targetListFileValue, scanRandomHosts, scanRandomHostsValue, portsToScan, portsToScanValue, fastScan, setTargetsOptions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="excludeHosts" className="whitespace-nowrap flex-shrink-0">
          Exclude Hosts/Networks (--exclude)
        </Label>
        <Checkbox
          id="excludeHosts"
          checked={excludeHosts}
          onCheckedChange={(checked) => setExcludeHosts(checked)}
        />
        <Input
          value={excludeHostsValue}
          onChange={(e) => setExcludeHostsValue(e.target.value)}
          disabled={!excludeHosts}
          placeholder="Host or network to exclude"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="exclusionFile" className="whitespace-nowrap flex-shrink-0">
          Exclusion File (--excludefile)
        </Label>
        <Checkbox
          id="exclusionFile"
          checked={exclusionFile}
          onCheckedChange={(checked) => setExclusionFile(checked)}
        />
        <Input
          value={exclusionFileValue}
          onChange={(e) => setExclusionFileValue(e.target.value)}
          disabled={!exclusionFile}
          placeholder="Path to exclusion file"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="targetListFile" className="whitespace-nowrap flex-shrink-0">
          Target List File (--targetlist)
        </Label>
        <Checkbox
          id="targetListFile"
          checked={targetListFile}
          onCheckedChange={(checked) => setTargetListFile(checked)}
        />
        <Input
          value={targetListFileValue}
          onChange={(e) => setTargetListFileValue(e.target.value)}
          disabled={!targetListFile}
          placeholder="Path to target list file"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="scanRandomHosts" className="whitespace-nowrap flex-shrink-0">
          Scan Random Hosts (--scanrandomhosts)
        </Label>
        <Checkbox
          id="scanRandomHosts"
          checked={scanRandomHosts}
          onCheckedChange={(checked) => setScanRandomHosts(checked)}
        />
        <Input
          value={scanRandomHostsValue}
          onChange={(e) => setScanRandomHostsValue(e.target.value)}
          disabled={!scanRandomHosts}
          placeholder="Number of random hosts"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="portsToScan" className="whitespace-nowrap flex-shrink-0">
          Ports to Scan (--ports)
        </Label>
        <Checkbox
          id="portsToScan"
          checked={portsToScan}
          onCheckedChange={(checked) => setPortsToScan(checked)}
        />
        <Input
          value={portsToScanValue}
          onChange={(e) => setPortsToScanValue(e.target.value)}
          disabled={!portsToScan}
          placeholder="Port range"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="fastScan" className="whitespace-nowrap flex-shrink-0">
          Fast Scan (--fast)
        </Label>
        <Checkbox id="fastScan" checked={fastScan} onCheckedChange={(checked) => setFastScan(checked)} />
      </div>
    </div>
  );
}
