import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";

export function ScanTab({ setScanCommand }) {
  const [tcpScan, setTcpScan] = useState(null);
  const [nonTcpScan, setNonTcpScan] = useState(null);
  const [timing, setTiming] = useState(null);
  const [idleScan, setIdleScan] = useState(false);
  const [idleScanValue, setIdleScanValue] = useState(""); // Value for idle scan if enabled
  const [ftpBounce, setFtpBounce] = useState(false);
  const [ftpBounceValue, setFtpBounceValue] = useState(""); // Value for FTP bounce if enabled
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [osDetection, setOsDetection] = useState(false);
  const [versionDetection, setVersionDetection] = useState(false);
  const [reverseDns, setReverseDns] = useState(false);
  const [ipv6, setIpv6] = useState(false);

  useEffect(() => {
    let command = "nmap"; // Starting with base command

    // Append selected options to the command string
    if (tcpScan) command += ` ${tcpScan}`;
    if (nonTcpScan) command += ` ${nonTcpScan}`;
    if (timing) command += ` ${timing}`;
    if (idleScan && idleScanValue) command += ` -sI ${idleScanValue}`;
    if (ftpBounce && ftpBounceValue) command += ` -b ${ftpBounceValue}`;
    if (advancedOptions) command += " -A";
    if (osDetection) command += " -O";
    if (versionDetection) command += " -sV";
    if (reverseDns) command += " -n";
    if (ipv6) command += " -6";

    // Pass the full command string back to ProfileTab via the setScanCommand function
    setScanCommand(command);
  }, [
    tcpScan, nonTcpScan, timing, idleScan, idleScanValue,
    ftpBounce, ftpBounceValue, advancedOptions, osDetection,
    versionDetection, reverseDns, ipv6, setScanCommand
  ]);

  return (
    <div className="space-y-4">
      {/* TCP Scan */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="TCP Scan" className="whitespace-nowrap flex-shrink-0">TCP Scan</Label>
        <Select onValueChange={(value) => setTcpScan(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>None</SelectItem>
            <SelectItem value="-sA">ACK Scan (-sA)</SelectItem>
            <SelectItem value="-sS">SYN Scan (-sS)</SelectItem>
            <SelectItem value="-sF">FIN Scan (-sF)</SelectItem>
            <SelectItem value="-sX">XMAS Scan (-sX)</SelectItem>
            <SelectItem value="-sN">NULL Scan (-sN)</SelectItem>
            <SelectItem value="-sT">TCP Connect Scan (-sT)</SelectItem>
            <SelectItem value="-sW">Windows Scan (-sW)</SelectItem>
            <SelectItem value="-sM">Maimon Scan (-sM)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Non-TCP Scan */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Non-TCP Scan" className="whitespace-nowrap flex-shrink-0">Non-TCP Scan</Label>
        <Select onValueChange={(value) => setNonTcpScan(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>None</SelectItem>
            <SelectItem value="-sU">UDP Scan (-sU)</SelectItem>
            <SelectItem value="-sY">SCTP Scan (-sY)</SelectItem>
            <SelectItem value="-sN">No Port Scan (-sN)</SelectItem>
            <SelectItem value="-sO">IP Protocol Scan (-sO)</SelectItem>
            <SelectItem value="-sL">List Scan (-sL)</SelectItem>
            <SelectItem value="-sZ">SCTP Cookie-Echo Scan (-sZ)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timing Template */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Timing Template" className="whitespace-nowrap flex-shrink-0">Timing Template</Label>
        <Select onValueChange={(value) => setTiming(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Default (-T3)</SelectItem>
            <SelectItem value="-T0">Paranoid (-T0)</SelectItem>
            <SelectItem value="-T1">Sneaky (-T1)</SelectItem>
            <SelectItem value="-T2">Polite (-T2)</SelectItem>
            <SelectItem value="-T4">Aggressive (-T4)</SelectItem>
            <SelectItem value="-T5">Insane (-T5)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Scan Options */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Idle Scan (-sI)" className="whitespace-nowrap flex-shrink-0">Idle Scan (Zombie Scan) (-sI)</Label>
        <Checkbox checked={idleScan} onCheckedChange={(checked) => setIdleScan(checked)} />
        <Input value={idleScanValue} onChange={(e) => setIdleScanValue(e.target.value)} disabled={!idleScan} placeholder="<zombie host[:probeport]>" />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="FTP Bounce Scan (-b)" className="whitespace-nowrap flex-shrink-0">FTP Bounce Scan (-b)</Label>
        <Checkbox checked={ftpBounce} onCheckedChange={(checked) => setFtpBounce(checked)} />
        <Input value={ftpBounceValue} onChange={(e) => setFtpBounceValue(e.target.value)} disabled={!ftpBounce} placeholder=" <FTP relay host>" />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Advanced Options (-A)" className="whitespace-nowrap flex-shrink-0">Enable all Advanced/Aggressive options (-A)</Label>
        <Checkbox checked={advancedOptions} onCheckedChange={(checked) => setAdvancedOptions(checked)} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="OS Detection (-O)" className="whitespace-nowrap flex-shrink-0">OS Detection (-O)</Label>
        <Checkbox checked={osDetection} onCheckedChange={(checked) => setOsDetection(checked)} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Version Detection (-sV)" className="whitespace-nowrap flex-shrink-0">Version Detection (-sV)</Label>
        <Checkbox checked={versionDetection} onCheckedChange={(checked) => setVersionDetection(checked)} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Reverse DNS (-n)" className="whitespace-nowrap flex-shrink-0">Skip Reverse DNS Resolution (-n)</Label>
        <Checkbox checked={reverseDns} onCheckedChange={(checked) => setReverseDns(checked)} />
      </div>
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="IPv6 Scan (-6)" className="whitespace-nowrap flex-shrink-0">IPv6 Scan (-6)</Label>
        <Checkbox checked={ipv6} onCheckedChange={(checked) => setIpv6(checked)} />
      </div>
    </div>
  );
}
