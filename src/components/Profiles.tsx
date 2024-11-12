import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommandIcon } from "lucide-react";
import { ScanTab } from "./profiletabs/scanTab";
import { PingTab } from "./profiletabs/pingTab"
export function Profiles() {
  const [profileName, setProfileName] = useState("Demo Scan");
  const [description, setDescription] = useState("My Custom Profile");
  const [generatedCommand, setGeneratedCommand] = useState("nmap");

  // Generate profile string with selected options
  const generateProfileString = () => {
    // Build profile string (this function should remain unchanged)
    return `Profile Name: ${profileName}\nDescription: ${description}\nCommand: ${generatedCommand}`;
  };

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
              <ScanTab setScanCommand={setGeneratedCommand} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add content for the other tabs */}
        <TabsContent value="Ping">
          <Card>
            <CardHeader>
              <CardTitle>Ping Options</CardTitle>
              <CardDescription>Configure ping options here.</CardDescription>
            </CardHeader>
            <CardContent>
            <PingTab setScanCommand={setGeneratedCommand} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Scripting">
          <Card>
            <CardHeader>
              <CardTitle>Scripting Options</CardTitle>
              <CardDescription>Configure Nmap Scripting Engine options here.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your Scripting tab options here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Target">
          <Card>
            <CardHeader>
              <CardTitle>Target Options</CardTitle>
              <CardDescription>Define target specifications here.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your Target tab options here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Source">
          <Card>
            <CardHeader>
              <CardTitle>Source Options</CardTitle>
              <CardDescription>Configure source options here.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your Source tab options here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Others">
          <Card>
            <CardHeader>
              <CardTitle>Other Options</CardTitle>
              <CardDescription>Additional Nmap options.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add other options here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Timing">
          <Card>
            <CardHeader>
              <CardTitle>Timing Options</CardTitle>
              <CardDescription>Configure Nmap timing options here.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add your Timing tab options here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button className="mt-4" onClick={() => alert(generateProfileString())}>Save Profile</Button>
    </div>
  );
}
