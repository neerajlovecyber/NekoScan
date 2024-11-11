import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
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
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
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
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
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
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
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
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
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
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
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
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
