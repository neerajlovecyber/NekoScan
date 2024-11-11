import { Button } from "@/components/ui/button"
import {Card,CardContent, CardDescription, CardFooter, CardHeader, CardTitle,}from"@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Tabs,TabsContent,TabsList, TabsTrigger,} from "@/components/ui/tabs"
import {Select,SelectContent,SelectItem,SelectTrigger, SelectValue,} from "@/components/ui/select"
import { Checkbox } from "./ui/checkbox"
export function Profiles() {
  return (
    <div>
      <div className="space-y-1">
        <Label htmlFor="name">Profile Name</Label>
        <Input id="name" defaultValue="Demo Scan" />
      </div>
      <div className="space-y-1 pb-4">
        <Label htmlFor="description">Profile Description</Label>
        <Input id="description" defaultValue="My Custom Profile" />
      </div>
      
      
      <Tabs defaultValue="Scan" className="">
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
              <CardDescription>
                Configure scan options here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add Scan-specific content here */}
              <div className="flex items-center space-x-2 w-full">
  <Label htmlFor="TCP Scan" className="whitespace-nowrap flex-shrink-0">
    TCP Scan
  </Label>
  <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
   
    <SelectItem value="ACK scan">ACK Scan (-sA)</SelectItem>
    <SelectItem value="TCP SYN scan">SYN Scan (-sS)</SelectItem>
    <SelectItem value="FIN scan">FIN Scan (-sF)</SelectItem>
    <SelectItem value="XMAS scan">XMAS Scan (-sX)</SelectItem>
    <SelectItem value="NULL scan">NULL Scan (-sN)</SelectItem>
    <SelectItem value="TCP Connect scan">TCP Connect Scan (-sT)</SelectItem>
    <SelectItem value="Windows scan">Windows Scan (-sW)</SelectItem>
    <SelectItem value="Maimon scan">Maimon Scan (-sM)</SelectItem>

  </SelectContent>
</Select>
</div>
<div className="flex items-center space-x-2 w-full">
  <Label htmlFor="Non-TCP Scan" className="whitespace-nowrap flex-shrink-0">
    Non-TCP Scan
  </Label>
  <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    
    <SelectItem value="UDP scan">UDP Scan (-sU)</SelectItem>
    <SelectItem value="SCTP scan">SCTP Scan (-sY)</SelectItem>
    <SelectItem value="No port scan">No Port Scan (-sN)</SelectItem>
    <SelectItem value="IP Protocol scan">IP Protocol Scan (-sO)</SelectItem>
    <SelectItem value="List scan">List Scan (-sL)</SelectItem>
    <SelectItem value="SCTP cookie-echo scan">SCTP Cookie-Echo Scan (-sZ)</SelectItem>
    

  </SelectContent>
</Select>
</div>
<div className="flex items-center space-x-2 w-full">
  <Label htmlFor="Timing Template" className="whitespace-nowrap flex-shrink-0">
    Timing Template
  </Label>
  <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="-T0">Paranoid (-T0)</SelectItem>
    <SelectItem value="-T1">Sneaky (-T1)</SelectItem>
    <SelectItem value="-T2">Polite (-T2)</SelectItem>
    <SelectItem value="-T3">Normal (-T3)</SelectItem>
    <SelectItem value="-T4">Aggressive (-T4)</SelectItem>
    <SelectItem value="-T5">Insane (-T5)</SelectItem>

  </SelectContent>
</Select>
</div>
<div className="flex items-center space-x-2 w-full">
  <Label htmlFor="enaable all Advanced/Aggressive options (-A)" className="whitespace-nowrap flex-shrink-0">
    Enable all Advanced/Aggressive options (-A)
  </Label>

 <Checkbox id="enable-all-advanced-aggressive-options" />

</div>
            </CardContent>
  
          </Card>
        </TabsContent>

        <TabsContent value="Ping">
          <Card>
            <CardHeader>
              <CardTitle>Ping</CardTitle>
              <CardDescription>
                Configure ping options here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add Ping-specific content here */}
            </CardContent>
  
          </Card>
        </TabsContent>

        <TabsContent value="Scripting">
          <Card>
            <CardHeader>
              <CardTitle>Scripting</CardTitle>
              <CardDescription>
                Configure scripting options here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add Scripting-specific content here */}
            </CardContent>
  
          </Card>
        </TabsContent>

        <TabsContent value="Target">
          <Card>
            <CardHeader>
              <CardTitle>Target</CardTitle>
              <CardDescription>
                Configure target options here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add Target-specific content here */}
            </CardContent>
  
          </Card>
        </TabsContent>

        <TabsContent value="Source">
          <Card>
            <CardHeader>
              <CardTitle>Source</CardTitle>
              <CardDescription>
                Configure source options here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add Source-specific content here */}
            </CardContent>
  
          </Card>
        </TabsContent>

        <TabsContent value="Others">
          <Card>
            <CardHeader>
              <CardTitle>Others</CardTitle>
              <CardDescription>
                Configure other options here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add Others-specific content here */}
            </CardContent>
  
          </Card>
        </TabsContent>

        <TabsContent value="Timing">
          <Card>
            <CardHeader>
              <CardTitle>Timing</CardTitle>
              <CardDescription>
                Configure timing options here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add Timing-specific content here */}
            </CardContent>
  
          </Card>
        </TabsContent>
      </Tabs>
      <div className="py-4">
              <Button >Save changes</Button>
              </div> 
    </div>
  )
}
