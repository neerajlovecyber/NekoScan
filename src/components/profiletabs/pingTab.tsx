import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function PingTab({ setPingOptions }) {
  // Load the state from localStorage when the component mounts
  const loadStateFromLocalStorage = () => {
    return {
      dontPing: JSON.parse(localStorage.getItem("dontPing")) || false,
      icmpPing: JSON.parse(localStorage.getItem("icmpPing")) || false,
      icmpTimestamp: JSON.parse(localStorage.getItem("icmpTimestamp")) || false,
      icmpNetmask: JSON.parse(localStorage.getItem("icmpNetmask")) || false,
      ackPing: JSON.parse(localStorage.getItem("ackPing")) || false,
      ackPingValue: localStorage.getItem("ackPingValue") || "",
      synPing: JSON.parse(localStorage.getItem("synPing")) || false,
      synPingValue: localStorage.getItem("synPingValue") || "",
      udpProbes: JSON.parse(localStorage.getItem("udpProbes")) || false,
      udpProbesValue: localStorage.getItem("udpProbesValue") || "",
      ipProtoProbes: JSON.parse(localStorage.getItem("ipProtoProbes")) || false,
      ipProtoProbesValue: localStorage.getItem("ipProtoProbesValue") || "",
      sctpInitPing: JSON.parse(localStorage.getItem("sctpInitPing")) || false,
      sctpInitPingValue: localStorage.getItem("sctpInitPingValue") || "",
    };
  };

  const [dontPing, setDontPing] = useState(loadStateFromLocalStorage().dontPing);
  const [icmpPing, setIcmpPing] = useState(loadStateFromLocalStorage().icmpPing);
  const [icmpTimestamp, setIcmpTimestamp] = useState(loadStateFromLocalStorage().icmpTimestamp);
  const [icmpNetmask, setIcmpNetmask] = useState(loadStateFromLocalStorage().icmpNetmask);
  const [ackPing, setAckPing] = useState(loadStateFromLocalStorage().ackPing);
  const [ackPingValue, setAckPingValue] = useState(loadStateFromLocalStorage().ackPingValue);
  const [synPing, setSynPing] = useState(loadStateFromLocalStorage().synPing);
  const [synPingValue, setSynPingValue] = useState(loadStateFromLocalStorage().synPingValue);
  const [udpProbes, setUdpProbes] = useState(loadStateFromLocalStorage().udpProbes);
  const [udpProbesValue, setUdpProbesValue] = useState(loadStateFromLocalStorage().udpProbesValue);
  const [ipProtoProbes, setIpProtoProbes] = useState(loadStateFromLocalStorage().ipProtoProbes);
  const [ipProtoProbesValue, setIpProtoProbesValue] = useState(loadStateFromLocalStorage().ipProtoProbesValue);
  const [sctpInitPing, setSctpInitPing] = useState(loadStateFromLocalStorage().sctpInitPing);
  const [sctpInitPingValue, setSctpInitPingValue] = useState(loadStateFromLocalStorage().sctpInitPingValue);

  // Save the state to localStorage whenever any state changes
  useEffect(() => {
    localStorage.setItem("dontPing", JSON.stringify(dontPing));
    localStorage.setItem("icmpPing", JSON.stringify(icmpPing));
    localStorage.setItem("icmpTimestamp", JSON.stringify(icmpTimestamp));
    localStorage.setItem("icmpNetmask", JSON.stringify(icmpNetmask));
    localStorage.setItem("ackPing", JSON.stringify(ackPing));
    localStorage.setItem("ackPingValue", ackPingValue);
    localStorage.setItem("synPing", JSON.stringify(synPing));
    localStorage.setItem("synPingValue", synPingValue);
    localStorage.setItem("udpProbes", JSON.stringify(udpProbes));
    localStorage.setItem("udpProbesValue", udpProbesValue);
    localStorage.setItem("ipProtoProbes", JSON.stringify(ipProtoProbes));
    localStorage.setItem("ipProtoProbesValue", ipProtoProbesValue);
    localStorage.setItem("sctpInitPing", JSON.stringify(sctpInitPing));
    localStorage.setItem("sctpInitPingValue", sctpInitPingValue);
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
  ]);

  useEffect(() => {
    const commandOptions = [];

    if (dontPing) commandOptions.push(" -Pn");
    if (icmpPing) commandOptions.push(" -PE");
    if (icmpTimestamp) commandOptions.push(" -PP");
    if (icmpNetmask) commandOptions.push(" -PM");
    if (ackPing) commandOptions.push(` -PA${ackPingValue}`);
    if (synPing) commandOptions.push(` -PS${synPingValue}`);
    if (udpProbes) commandOptions.push(` -PU${udpProbesValue}`);
    if (ipProtoProbes) commandOptions.push(` -PO${ipProtoProbesValue}`);
    if (sctpInitPing) commandOptions.push(` -PY${sctpInitPingValue}`);

    setPingOptions(commandOptions.join(" ").trim());
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
    setPingOptions,
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
          placeholder="<port list>"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="synPing" className="whitespace-nowrap flex-shrink-0">SYN Ping (-PS)</Label>
        <Checkbox id="synPing" checked={synPing} onCheckedChange={setSynPing} />
        <Input
          value={synPingValue}
          onChange={(e) => setSynPingValue(e.target.value)}
          disabled={!synPing}
          placeholder="<port list>"
        />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="udpProbes" className="whitespace-nowrap flex-shrink-0">UDP Probes (-PU)</Label>
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
