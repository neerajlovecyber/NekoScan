import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface OtherTabProps {
  setOtherOptions: (options: string) => void;
}

export function OtherTab({ setOtherOptions }: OtherTabProps) {
  const [extraOptions, setExtraOptions] = useState("");
  const [ttl, setTtl] = useState("");
  const [fragmentPackets, setFragmentPackets] = useState(false);
  const [verbosity, setVerbosity] = useState(1); // Keeping verbosity from 1
  const [debugLevel, setDebugLevel] = useState(0);
  const [packetTrace, setPacketTrace] = useState(false);
  const [disableRandomization, setDisableRandomization] = useState(false);
  const [traceRoute, setTraceRoute] = useState(false);
  const [maxRetries, setMaxRetries] = useState("");

  useEffect(() => {
    const options = [];
    if (extraOptions) options.push(extraOptions);
    if (ttl) options.push(`--ttl ${ttl}`);
    if (fragmentPackets) options.push("-f");
    if (verbosity > 0) options.push(`-v${"v".repeat(verbosity - 1)}`); // Keep counter values 1, 2, 3...
    if (debugLevel > 0) options.push(`-d${debugLevel}`);
    if (packetTrace) options.push("--packet-trace");
    if (disableRandomization) options.push("-r");
    if (traceRoute) options.push("--traceroute");
    if (maxRetries) options.push(`--max-retries ${maxRetries}`);

    setOtherOptions(options.join(" ").trim());
  }, [
    extraOptions, ttl, fragmentPackets, verbosity, debugLevel,
    packetTrace, disableRandomization, traceRoute, maxRetries,
    setOtherOptions
  ]);

  return (
    <div className="space-y-4">
      {/* Extra Options Input */}
      <div className="flex items-center space-x-2 w-full">
        <Label htmlFor="extraOptions" className="whitespace-nowrap flex-shrink-0">Extra Options (user-defined)</Label>
        <Input
          id="extraOptions"
          value={extraOptions}
          onChange={(e) => setExtraOptions(e.target.value)}
          placeholder="Enter any additional options"
        />
      </div>

      {/* TTL Input */}
      <div className="space-y-4">
      {/* Extra Options Input */}
      <div className="flex items-center space-x-2 w-full">
      <Label htmlFor="extraOptions" className="whitespace-nowrap flex-shrink-0">Set IPv4 TTL (--ttl)</Label>
        <Input
          id="ttl"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          placeholder="Enter TTL value"
        />
      </div></div>

      {/* Max Retries Input */}
      <div className="space-y-4">
      {/* Extra Options Input */}
      <div className="flex items-center space-x-2 w-full">
      <Label htmlFor="extraOptions" className="whitespace-nowrap flex-shrink-0">Set Max Retries (--max-retries)</Label>
        <Input
          id="maxRetries"
          value={maxRetries}
          onChange={(e) => setMaxRetries(e.target.value)}
          placeholder="Enter max retries"
        />
      </div>
        </div>

      {/* Checkboxes grouped together */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fragmentPackets"
            checked={fragmentPackets}
            onCheckedChange={(checked) => setFragmentPackets(checked === true)}
          />
          <Label htmlFor="fragmentPackets">Fragment IP Packets (-f)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="packetTrace"
            checked={packetTrace}
            onCheckedChange={(checked) => setPacketTrace(checked === true)}
          />
          <Label htmlFor="packetTrace">Packet Trace (--packet-trace)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="disableRandomization"
            checked={disableRandomization}
            onCheckedChange={(checked) => setDisableRandomization(checked === true)}
          />
          <Label htmlFor="disableRandomization">Disable Port Randomization (-r)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="traceRoute"
            checked={traceRoute}
            onCheckedChange={(checked) => setTraceRoute(checked === true)}
          />
          <Label htmlFor="traceRoute">Trace Route (--traceroute)</Label>
        </div>
      </div>

      {/* Verbosity Level with correct v display */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="verbosity" className="whitespace-nowrap flex-shrink-0">Verbosity Level (-v)</Label>
        <div className="flex items-center space-x-1">
          <Button size="sm" onClick={() => setVerbosity(Math.max(1, verbosity - 1))}>-</Button>
          <span>{verbosity}</span>
          <Button size="sm" onClick={() => setVerbosity(Math.min(10, verbosity + 1))}>+</Button>
        </div>
      </div>

      {/* Debug Level */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="debugLevel" className="whitespace-nowrap flex-shrink-0">Debugging Level (-d)</Label>
        <div className="flex items-center space-x-1">
          <Button size="sm" onClick={() => setDebugLevel(Math.max(0, debugLevel - 1))}>-</Button>
          <span>{debugLevel}</span>
          <Button size="sm" onClick={() => setDebugLevel(Math.min(10, debugLevel + 1))}>+</Button>
        </div>
      </div>
    </div>
  );
}
