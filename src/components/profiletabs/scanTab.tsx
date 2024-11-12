import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";

export function ScanTab({ setScanOptions }) {
  // Helper function to load values from localStorage
  const loadStateFromLocalStorage = () => {
    return {
      tcpScan: localStorage.getItem("tcpScan") || "",
      nonTcpScan: localStorage.getItem("nonTcpScan") || "",
      timing: localStorage.getItem("timing") || "",
      idleScan: JSON.parse(localStorage.getItem("idleScan") || "false"), 
      idleScanValue: localStorage.getItem("idleScanValue") || "",
      ftpBounce: JSON.parse(localStorage.getItem("ftpBounce") || "false"),
      ftpBounceValue: localStorage.getItem("ftpBounceValue") || "",
      advancedOptions: JSON.parse(localStorage.getItem("advancedOptions") || "false"),
      osDetection: JSON.parse(localStorage.getItem("osDetection") || "false"),
      versionDetection: JSON.parse(localStorage.getItem("versionDetection") || "false"),
      reverseDns: JSON.parse(localStorage.getItem("reverseDns") || "false"),
      ipv6: JSON.parse(localStorage.getItem("ipv6") || "false"),
    };
  };

  const [tcpScan, setTcpScan] = useState(loadStateFromLocalStorage().tcpScan);
  const [nonTcpScan, setNonTcpScan] = useState(loadStateFromLocalStorage().nonTcpScan);
  const [timing, setTiming] = useState(loadStateFromLocalStorage().timing);
  const [idleScan, setIdleScan] = useState(loadStateFromLocalStorage().idleScan);
  const [idleScanValue, setIdleScanValue] = useState(loadStateFromLocalStorage().idleScanValue);
  const [ftpBounce, setFtpBounce] = useState(loadStateFromLocalStorage().ftpBounce);
  const [ftpBounceValue, setFtpBounceValue] = useState(loadStateFromLocalStorage().ftpBounceValue);
  const [advancedOptions, setAdvancedOptions] = useState(loadStateFromLocalStorage().advancedOptions);
  const [osDetection, setOsDetection] = useState(loadStateFromLocalStorage().osDetection);
  const [versionDetection, setVersionDetection] = useState(loadStateFromLocalStorage().versionDetection);
  const [reverseDns, setReverseDns] = useState(loadStateFromLocalStorage().reverseDns);
  const [ipv6, setIpv6] = useState(loadStateFromLocalStorage().ipv6);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tcpScan", tcpScan || "");
    localStorage.setItem("nonTcpScan", nonTcpScan || "");
    localStorage.setItem("timing", timing || "");
    localStorage.setItem("idleScan", JSON.stringify(idleScan));
    localStorage.setItem("idleScanValue", idleScanValue || "");
    localStorage.setItem("ftpBounce", JSON.stringify(ftpBounce));
    localStorage.setItem("ftpBounceValue", ftpBounceValue || "");
    localStorage.setItem("advancedOptions", JSON.stringify(advancedOptions));
    localStorage.setItem("osDetection", JSON.stringify(osDetection));
    localStorage.setItem("versionDetection", JSON.stringify(versionDetection));
    localStorage.setItem("reverseDns", JSON.stringify(reverseDns));
    localStorage.setItem("ipv6", JSON.stringify(ipv6));
  }, [
    tcpScan, nonTcpScan, timing, idleScan, idleScanValue,
    ftpBounce, ftpBounceValue, advancedOptions, osDetection,
    versionDetection, reverseDns, ipv6,
  ]);

  // Generate command string based on current state
  useEffect(() => {
    const commandOptions = [];
    if (tcpScan) commandOptions.push(` ${tcpScan}`);
    if (nonTcpScan) commandOptions.push(` ${nonTcpScan}`);
    if (timing) commandOptions.push(` ${timing}`);
    if (idleScan && idleScanValue) commandOptions.push(` -sI ${idleScanValue}`);
    if (ftpBounce && ftpBounceValue) commandOptions.push(` -b ${ftpBounceValue}`);
    if (advancedOptions) commandOptions.push(" -A");
    if (osDetection) commandOptions.push(" -O");
    if (versionDetection) commandOptions.push(" -sV");
    if (reverseDns) commandOptions.push(" -n");
    if (ipv6) commandOptions.push(" -6");

    setScanOptions(commandOptions.join(" ").trim());
  }, [
    tcpScan, nonTcpScan, timing, idleScan, idleScanValue,
    ftpBounce, ftpBounceValue, advancedOptions, osDetection,
    versionDetection, reverseDns, ipv6, setScanOptions,
  ]);
  return (
    <div className="space-y-4">
      {/* TCP Scan */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="TCP Scan" className="whitespace-nowrap flex-shrink-0">TCP Scan</Label>
        <Select onValueChange={(value) => setTcpScan(value)} value={tcpScan}>
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
        <Select onValueChange={(value) => setNonTcpScan(value)} value={nonTcpScan}>
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
        <Select onValueChange={(value) => setTiming(value)} value={timing}>
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

      {/* Idle Scan */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Idle Scan (-sI)" className="whitespace-nowrap flex-shrink-0">Idle Scan (Zombie Scan) (-sI)</Label>
        <Checkbox checked={idleScan} onCheckedChange={(checked) => setIdleScan(checked)} />
        <Input value={idleScanValue} onChange={(e) => setIdleScanValue(e.target.value)} disabled={!idleScan} placeholder="<zombie host[:probeport]>" />
      </div>

      {/* FTP Bounce Scan */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="FTP Bounce Scan (-b)" className="whitespace-nowrap flex-shrink-0">FTP Bounce Scan (-b)</Label>
        <Checkbox checked={ftpBounce} onCheckedChange={(checked) => setFtpBounce(checked)} />
        <Input value={ftpBounceValue} onChange={(e) => setFtpBounceValue(e.target.value)} disabled={!ftpBounce} placeholder=" <FTP relay host>" />
      </div>

      {/* Advanced Options */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Advanced Options (-A)" className="whitespace-nowrap flex-shrink-0">Advanced Options (-A)</Label>
        <Checkbox checked={advancedOptions} onCheckedChange={(checked) => setAdvancedOptions(checked)} />
      </div>

      {/* OS Detection */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="OS Detection (-O)" className="whitespace-nowrap flex-shrink-0">OS Detection (-O)</Label>
        <Checkbox checked={osDetection} onCheckedChange={(checked) => setOsDetection(checked)} />
      </div>

      {/* Version Detection */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Version Detection (-sV)" className="whitespace-nowrap flex-shrink-0">Version Detection (-sV)</Label>
        <Checkbox checked={versionDetection} onCheckedChange={(checked) => setVersionDetection(checked)} />
      </div>

      {/* Reverse DNS Resolution */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="Reverse DNS Resolution (-n)" className="whitespace-nowrap flex-shrink-0">Reverse DNS Resolution (-n)</Label>
        <Checkbox checked={reverseDns} onCheckedChange={(checked) => setReverseDns(checked)} />
      </div>

      {/* IPv6 Support */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="IPv6 Support (-6)" className="whitespace-nowrap flex-shrink-0">IPv6 Support (-6)</Label>
        <Checkbox checked={ipv6} onCheckedChange={(checked) => setIpv6(checked)} />
      </div>
    </div>
  );
}
