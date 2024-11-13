import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SourceTabProps {
  setSourceOptions: (options: string) => void;
}

export function SourceTab({ setSourceOptions }: SourceTabProps) {
  const [decoys, setDecoys] = useState("");
  const [sourceIP, setSourceIP] = useState("");
  const [sourcePort, setSourcePort] = useState("");
  const [networkInterface, setNetworkInterface] = useState("");

  // Update source options whenever any field changes
  useEffect(() => {
    const options = [];
    if (decoys) options.push(`-D ${decoys}`);
    if (sourceIP) options.push(`-S ${sourceIP}`);
    if (sourcePort) options.push(`--source-port ${sourcePort}`);
    if (networkInterface) options.push(`-e ${networkInterface}`);
    
    setSourceOptions(options.join(" ").trim());
  }, [decoys, sourceIP, sourcePort, networkInterface, setSourceOptions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="decoys" className="whitespace-nowrap flex-shrink-0">Use Decoys (-D)</Label>
        <Input
          id="decoys"
          value={decoys}
          onChange={(e) => setDecoys(e.target.value)}
          placeholder="Enter decoy IPs"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="sourceIP" className="whitespace-nowrap flex-shrink-0">Source IP Address (-S)</Label>
        <Input
          id="sourceIP"
          value={sourceIP}
          onChange={(e) => setSourceIP(e.target.value)}
          placeholder="Enter source IP"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="sourcePort" className="whitespace-nowrap flex-shrink-0">Source Port (--source-port)</Label>
        <Input
          id="sourcePort"
          value={sourcePort}
          onChange={(e) => setSourcePort(e.target.value)}
          placeholder="Enter source port"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="networkInterface" className="whitespace-nowrap flex-shrink-0">Network Interface (-e)</Label>
        <Input
          id="networkInterface"
          value={networkInterface}
          onChange={(e) => setNetworkInterface(e.target.value)}
          placeholder="Enter network interface"
        />
      </div>
    </div>
  );
}
