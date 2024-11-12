import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommandIcon } from "lucide-react";
import { ScanTab } from "./profiletabs/scanTab";
import { PingTab } from "./profiletabs/pingTab";
import { ScriptsTab } from "./profiletabs/scriptsTab";  // Ensure this is the correct import

export function Profiles() {
  const [profileName, setProfileName] = useState("Demo Scan");
  const [description, setDescription] = useState("My Custom Profile");
  const [scanOptions, setScanOptions] = useState(""); // Store options from ScanTab
  const [pingOptions, setPingOptions] = useState(""); // Store options from PingTab
  const [scriptsOptions, setScriptsOptions] = useState(""); // Store options from ScriptsTab
  const [generatedCommand, setGeneratedCommand] = useState("nmap "); // Initial nmap command

  useEffect(() => {
    updateCommand();
  }, [scanOptions, pingOptions, scriptsOptions]); // Update command when any option changes

  // Append new options to the command from ScanTab, PingTab, and ScriptsTab
  const updateCommand = () => {
    const fullCommand = `nmap ${scanOptions} ${pingOptions} ${scriptsOptions}`.trim();
    setGeneratedCommand(fullCommand);
  };

  // Generate profile string with selected options
  const generateProfileString = () => {
    return `Profile Name: ${profileName}\nDescription: ${description}\nCommand: ${generatedCommand}`;
  };

  return (
    <div>
      <div className="space-y-1">
        <Label htmlFor="name">Profile Name</Label>
        <Input
          id="name"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
      </div>
      <div className="space-y-1 pb-4">
        <Label htmlFor="description">Profile Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2 w-full">
        <label className="flex items-center space-x-2 pb-4">
          <CommandIcon />
        </label>
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
              <ScanTab setScanOptions={setScanOptions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Ping">
          <Card>
            <CardHeader>
              <CardTitle>Ping Options</CardTitle>
              <CardDescription>Configure ping options here.</CardDescription>
            </CardHeader>
            <CardContent>
              <PingTab setPingOptions={setPingOptions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Scripting">
          <Card>
            <CardHeader>
              <CardTitle>Scripting</CardTitle>
              <CardDescription>Configure scripting options here.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScriptsTab setScriptsOptions={setScriptsOptions} />  {/* Ensure ScriptsTab is setting the correct value */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tabs content as needed */}
      </Tabs>

      <Button className="mt-4" onClick={() => alert(generateProfileString())}>
        Save Profile
      </Button>
    </div>
  );
}
