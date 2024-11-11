import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { CommandIcon } from "lucide-react";

export function Profiles() {
  // State variables for each option
  const [profileName, setProfileName] = useState("Demo Scan");
  const [description, setDescription] = useState("My Custom Profile");
  const [tcpScan, setTcpScan] = useState(null); // Changed from "" to null
  const [nonTcpScan, setNonTcpScan] = useState(null); // Changed from "" to null
  const [timing, setTiming] = useState(null); // Changed from "" to null
  const [idleScan, setIdleScan] = useState(false);
  const [ftpBounce, setFtpBounce] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [osDetection, setOsDetection] = useState(false);
  const [versionDetection, setVersionDetection] = useState(false);
  const [reverseDns, setReverseDns] = useState(false);
  const [ipv6, setIpv6] = useState(false);
  const [generatedCommand, setGeneratedCommand] = useState("nmap");

  // Update command based on the selected options
  useEffect(() => {
    let command = "nmap";

    if (tcpScan) command += ` ${tcpScan}`;
    if (nonTcpScan) command += ` ${nonTcpScan}`;
    if (timing) command += ` ${timing}`;
    if (idleScan) command += " -sI";
    if (ftpBounce) command += " -b";
    if (advancedOptions) command += " -A";
    if (osDetection) command += " -O";
    if (versionDetection) command += " -sV";
    if (reverseDns) command += " -n";
    if (ipv6) command += " -6";

    setGeneratedCommand(command);
  }, [
    tcpScan,
    nonTcpScan,
    timing,
    idleScan,
    ftpBounce,
    advancedOptions,
    osDetection,
    versionDetection,
    reverseDns,
    ipv6,
  ]);

  return (
    <div>
      <div className="space-y-1">
        <Label htmlFor="name">Profile Name</Label>
        <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
      </div>
      <div className="space-y-1 pb-4">
        <Label htmlFor="description">Profile Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="flex items-center space-x-2 w-full ">
        <label className="flex items-center space-x-2 pb-4 "><CommandIcon/></label>
        <div className="bg-gray-800 p-2 rounded text-white min-w-[300px] mb-4">
          <code>{generatedCommand}</code>
        </div>
      </div>

      <Tabs defaultValue="Scan">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="Scan">Scan</TabsTrigger>
          <TabsTrigger value="Ping">Ping</TabsTrigger>
          <TabsTrigger value="Scripting">Scripting</TabsTrigger>
          <TabsTrigger value="Target">Target</TabsTrigger>
          <TabsTrigger value="Source">Source</TabsTrigger>
          <TabsTrigger value="Others">Others</TabsTrigger>
          <TabsTrigger value="Timing">Timing</TabsTrigger>
        </TabsList>

        <TabsContent value="Scan">
          <Card>
            <CardHeader>
              <CardTitle>Scan</CardTitle>
              <CardDescription>Configure scan options here. Click save when you're done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 w-full">
                <Label htmlFor="TCP Scan" className="whitespace-nowrap flex-shrink-0">TCP Scan</Label>
                <Select onValueChange={(value) => setTcpScan(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>None</SelectItem> {/* Using null to indicate no selection */}
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

              <div className="flex items-center space-x-2 w-full">
                <Label htmlFor="Non-TCP Scan" className="whitespace-nowrap flex-shrink-0">Non-TCP Scan</Label>
                <Select onValueChange={(value) => setNonTcpScan(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>None</SelectItem> {/* Using null to indicate no selection */}
                    <SelectItem value="-sU">UDP Scan (-sU)</SelectItem>
                    <SelectItem value="-sY">SCTP Scan (-sY)</SelectItem>
                    <SelectItem value="-sN">No Port Scan (-sN)</SelectItem>
                    <SelectItem value="-sO">IP Protocol Scan (-sO)</SelectItem>
                    <SelectItem value="-sL">List Scan (-sL)</SelectItem>
                    <SelectItem value="-sZ">SCTP Cookie-Echo Scan (-sZ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 w-full">
                <Label htmlFor="Timing Template" className="whitespace-nowrap flex-shrink-0">Timing Template</Label>
                <Select onValueChange={(value) => setTiming(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Default (-T3)</SelectItem> {/* Using null to indicate no selection */}
                    <SelectItem value="-T0">Paranoid (-T0)</SelectItem>
                    <SelectItem value="-T1">Sneaky (-T1)</SelectItem>
                    <SelectItem value="-T2">Polite (-T2)</SelectItem>
                    <SelectItem value="-T4">Aggressive (-T4)</SelectItem>
                    <SelectItem value="-T5">Insane (-T5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Scan Options */}
              <div className="flex items-center space-x-2 w-full ">
                <Label htmlFor="Idle Scan (-sI)" className="whitespace-nowrap flex-shrink-0">Idle Scan (Zombie Scan) (-sI)</Label>
                <Checkbox checked={idleScan} onCheckedChange={(checked) => setIdleScan(checked)} />
              </div>
              <div className="flex items-center space-x-2 w-full ">
                <Label htmlFor="FTP Bounce Scan (-b)" className="whitespace-nowrap flex-shrink-0">FTP Bounce Scan (-b)</Label>
                <Checkbox checked={ftpBounce} onCheckedChange={(checked) => setFtpBounce(checked)} />
              </div>
              <div className="flex items-center space-x-2 w-full ">
                <Label htmlFor="Advanced Options (-A)" className="whitespace-nowrap flex-shrink-0">Enable all Advanced/Aggressive options (-A)</Label>
                <Checkbox checked={advancedOptions} onCheckedChange={(checked) => setAdvancedOptions(checked)} />
              </div>
              <div className="flex items-center space-x-2 w-full ">
                <Label htmlFor="OS Detection (-O)" className="whitespace-nowrap flex-shrink-0">OS Detection (-O)</Label>
                <Checkbox checked={osDetection} onCheckedChange={(checked) => setOsDetection(checked)} />
              </div>
              <div className="flex items-center space-x-2 w-full ">
                <Label htmlFor="Version Detection (-sV)" className="whitespace-nowrap flex-shrink-0">Version Detection (-sV)</Label>
                <Checkbox checked={versionDetection} onCheckedChange={(checked) => setVersionDetection(checked)} />
              </div>
              <div className="flex items-center space-x-2 w-full ">
                <Label htmlFor="Reverse DNS (-n)" className="whitespace-nowrap flex-shrink-0">Skip Reverse DNS Resolution (-n)</Label>
                <Checkbox checked={reverseDns} onCheckedChange={(checked) => setReverseDns(checked)} />
              </div>
              <div className="flex items-center space-x-2 w-full ">
                <Label htmlFor="IPv6 Scan (-6)" className="whitespace-nowrap flex-shrink-0">IPv6 Scan (-6)</Label>
                <Checkbox checked={ipv6} onCheckedChange={(checked) => setIpv6(checked)} />
              </div>
            </CardContent>

          </Card>
        </TabsContent>
      </Tabs>
      <Button className="mt-4">Save Profile</Button>
    </div>
  );
}
