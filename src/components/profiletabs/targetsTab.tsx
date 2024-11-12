import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function TargetsTab({ setTargetsOptions }) {
  // Load the state from localStorage when the component mounts
  const loadStateFromLocalStorage = () => {
    return {
      excludehosts: JSON.parse(localStorage.getItem("excludehosts")) || false,
      exclusionfile: JSON.parse(localStorage.getItem("exclusionfile")) || false,
      targetlistfile: JSON.parse(localStorage.getItem("targetlistfile")) || false,
      scanrandomhosts: JSON.parse(localStorage.getItem("scanrandomhosts")) || false,
      portstoscan: JSON.parse(localStorage.getItem("portstoscan")) || false,
      fastscan:  JSON.parse(localStorage.getItem("fastscan")) || "false",
      
    };
  };

  const [excludehosts, setexcludehosts] = useState(loadStateFromLocalStorage().excludehosts);
  const [exclusionfile, setexclusionfile] = useState(loadStateFromLocalStorage().exclusionfile);
  const [targetlistfile, setIcmpTimestamp] = useState(loadStateFromLocalStorage().targetlistfile);
  const [scanrandomhosts, setscanrandomhosts] = useState(loadStateFromLocalStorage().scanrandomhosts);
  const [portstoscan, setportstoscan] = useState(loadStateFromLocalStorage().portstoscan);
  const [fastscan, setfastscan] = useState(loadStateFromLocalStorage().fastscan);
 
  // Save the state to localStorage whenever any state changes
  useEffect(() => {
    localStorage.setItem("excludehosts", JSON.stringify(excludehosts));
    localStorage.setItem("exclusionfile", JSON.stringify(exclusionfile));
    localStorage.setItem("targetlistfile", JSON.stringify(targetlistfile));
    localStorage.setItem("scanrandomhosts", JSON.stringify(scanrandomhosts));
    localStorage.setItem("portstoscan", JSON.stringify(portstoscan));
    localStorage.setItem("fastscan", JSON.stringify(fastscan));
   
  }, [
   excludehosts,exclusionfile,targetlistfile,scanrandomhosts,portstoscan,fastscan

  ]);

  useEffect(() => {
    const commandOptions = [];

    if (excludehosts) commandOptions.push(` -excludehosts ${excludehostvalue}`);
    if (exclusionfile) commandOptions.push(` -excludefile ${exclusionfilevalue}`)
    if (targetlistfile) commandOptions.push(` -targetlistfile ${targetlistfilevalue}`)
    if (scanrandomhosts) commandOptions.push(` -scanrandomhosts ${scanrandomhostsvalue}`)
    if (portstoscan) commandOptions.push(` -portstoscan ${portstoscanvalue}`)
    if (fastscan) commandOptions.push(` -fastscan`)

    setTargetsOptions(commandOptions.join(" ").trim());
  }, [
    excludehosts, exclusionfile, targetlistfile, scanrandomhosts, portstoscan, fastscan, setTargetsOptions
  ]);

  return (
    <div className="space-y-4">

      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="icmpNetmask" className="whitespace-nowrap flex-shrink-0">Excude Hosts/Networks(--exclude)</Label>
        <Checkbox id="icmpNetmask" checked={icmpNetmask} onCheckedChange={setIcmpNetmask} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="ackPing" className="whitespace-nowrap flex-shrink-0">Exclusion File(--excludefile)</Label>
        <Checkbox id="ackPing" checked={ackPing} onCheckedChange={setAckPing} />
        <Input
          value={ackPingValue}
          onChange={(e) => setAckPingValue(e.target.value)}
          disabled={!ackPing}
          placeholder="<port list>"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="synPing" className="whitespace-nowrap flex-shrink-0">Target List File(--targetlistfile)</Label>
        <Checkbox id="synPing" checked={synPing} onCheckedChange={setSynPing} />
        <Input
          value={synPingValue}
          onChange={(e) => setSynPingValue(e.target.value)}
          disabled={!synPing}
          placeholder="<port list>"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="udpProbes" className="whitespace-nowrap flex-shrink-0">U
        <Checkbox id="udpProbes" checked={udpProbes} onCheckedChange={setUdpProbes} />
        <Input
          value={udpProbesValue}
          onChange={(e) => setUdpProbesValue(e.target.value)}
          disabled={!udpProbes}
          placeholder="<port list>"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="ipProtoProbes" className="whitespace-nowrap flex-shrink-0">IP Protocol Probes (-PO)</Label>
        <Checkbox id="ipProtoProbes" checked={ipProtoProbes} onCheckedChange={setIpProtoProbes} />
        <Input
          value={ipProtoProbesValue}
          onChange={(e) => setIpProtoProbesValue(e.target.value)}
          disabled={!ipProtoProbes}
          placeholder="<port list>"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="sctpInitPing" className="whitespace-nowrap flex-shrink-0">SCTP INIT Ping (-PY)</Label>
        <Checkbox id="sctpInitPing" checked={sctpInitPing} onCheckedChange={setSctpInitPing} />
        <Input
          value={sctpInitPingValue}
          onChange={(e) => setSctpInitPingValue(e.target.value)}
          disabled={!sctpInitPing}
          placeholder="<port list>"
        />
      </div>
    </div>
  );
}
