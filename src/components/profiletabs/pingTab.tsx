import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function PingTab({ setScanCommand }) {
  const [dontPing, setDontPing] = useState(false);
  const [icmpPing, setIcmpPing] = useState(false);
  const [icmpTimestamp, setIcmpTimestamp] = useState(false);
  const [icmpNetmask, setIcmpNetmask] = useState(false);
  const [ackPing, setAckPing] = useState(false);
  const [ackPingValue, setAckPingValue] = useState("");
  const [synPing, setSynPing] = useState(false);
  const [synPingValue, setSynPingValue] = useState("");
  const [udpProbes, setUdpProbes] = useState(false);
  const [udpProbesValue, setUdpProbesValue] = useState("");
  const [ipProtoProbes, setIpProtoProbes] = useState(false);
  const [ipProtoProbesValue, setIpProtoProbesValue] = useState("");
  const [sctpInitPing, setSctpInitPing] = useState(false);
  const [sctpInitPingValue, setSctpInitPingValue] = useState("");

  useEffect(() => {
    let commandOptions = "";

    if (dontPing) commandOptions += " -Pn";
    if (icmpPing) commandOptions += " -PE";
    if (icmpTimestamp) commandOptions += " -PP";
    if (icmpNetmask) commandOptions += " -PM";
    if (ackPing) commandOptions += ` -PA${ackPingValue}`;
    if (synPing) commandOptions += ` -PS${synPingValue}`;
    if (udpProbes) commandOptions += ` -PU${udpProbesValue}`;
    if (ipProtoProbes) commandOptions += ` -PO${ipProtoProbesValue}`;
    if (sctpInitPing) commandOptions += ` -PY${sctpInitPingValue}`;

    setScanCommand(commandOptions.trim());
  }, [
    dontPing,
    icmpPing,
    icmpTimestamp,
    icmpNetmask,
    ackPing,
    ackPingValue,
    synPing,
    synPingValue,
    udpProbes,
    udpProbesValue,
    ipProtoProbes,
    ipProtoProbesValue,
    sctpInitPing,
    sctpInitPingValue,
    setScanCommand,
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="dontPing" className="whitespace-nowrap flex-shrink-0">Don't Ping before scanning (-Pn)</Label>
        <Checkbox id="dontPing" checked={dontPing} onCheckedChange={setDontPing} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="icmpPing" className="whitespace-nowrap flex-shrink-0">ICMP Ping (-PE)</Label>
        <Checkbox id="icmpPing" checked={icmpPing} onCheckedChange={setIcmpPing} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="icmpTimestamp" className="whitespace-nowrap flex-shrink-0">ICMP Timestamp (-PP)</Label>
        <Checkbox id="icmpTimestamp" checked={icmpTimestamp} onCheckedChange={setIcmpTimestamp} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="icmpNetmask" className="whitespace-nowrap flex-shrink-0">ICMP Netmask Request (-PM)</Label>
        <Checkbox id="icmpNetmask" checked={icmpNetmask} onCheckedChange={setIcmpNetmask} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="ackPing" className="whitespace-nowrap flex-shrink-0">ACK Ping (-PA)</Label>
        <Checkbox id="ackPing" checked={ackPing} onCheckedChange={setAckPing} />
        <Input
          value={ackPingValue}
          onChange={(e) => setAckPingValue(e.target.value)}
          disabled={!ackPing}
          placeholder="HOST DISCOVERY: -PS/PA/PU/PY[portlist]"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="synPing" className="whitespace-nowrap flex-shrink-0">SYN Ping (-PS)</Label>
        <Checkbox id="synPing" checked={synPing} onCheckedChange={setSynPing} />
        <Input
          value={synPingValue}
          onChange={(e) => setSynPingValue(e.target.value)}
          disabled={!synPing}
          placeholder="HOST DISCOVERY: -PS/PA/PU/PY[portlist]"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="udpProbes" className="whitespace-nowrap flex-shrink-0">UDP Probes (-PU)</Label>
        <Checkbox id="udpProbes" checked={udpProbes} onCheckedChange={setUdpProbes} />
        <Input
          value={udpProbesValue}
          onChange={(e) => setUdpProbesValue(e.target.value)}
          disabled={!udpProbes}
          placeholder="HOST DISCOVERY: -PS/PA/PU/PY[portlist]"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="ipProtoProbes" className="whitespace-nowrap flex-shrink-0">IP Proto Probes (-PO)</Label>
        <Checkbox id="ipProtoProbes" checked={ipProtoProbes} onCheckedChange={setIpProtoProbes} />
        <Input
          value={ipProtoProbesValue}
          onChange={(e) => setIpProtoProbesValue(e.target.value)}
          disabled={!ipProtoProbes}
          placeholder="HOST DISCOVERY: -PO[protocol list]"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="sctpInitPing" className="whitespace-nowrap flex-shrink-0">SCTP INIT Ping Probes (-PY)</Label>
        <Checkbox id="sctpInitPing" checked={sctpInitPing} onCheckedChange={setSctpInitPing} />
        <Input
          value={sctpInitPingValue}
          onChange={(e) => setSctpInitPingValue(e.target.value)}
          disabled={!sctpInitPing}
          placeholder="HOST DISCOVERY: -PS/PA/PU/PY[portlist]"
        />
      </div>
    </div>
  );
}
