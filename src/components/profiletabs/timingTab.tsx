import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";


interface TimingTabProps {
  setTimingOptions: (options: string) => void;
}

export function TimingTab({ setTimingOptions }: TimingTabProps) {
  const [hostTimeout, setHostTimeout] = useState("");
  const [maxRttTimeout, setMaxRttTimeout] = useState("");
  const [minRttTimeout, setMinRttTimeout] = useState("");
  const [initialRttTimeout, setInitialRttTimeout] = useState("");
  const [maxHostGroup, setMaxHostGroup] = useState("");
  const [minHostGroup, setMinHostGroup] = useState("");
  const [maxParallelism, setMaxParallelism] = useState("");
  const [minParallelism, setMinParallelism] = useState("");
  const [maxScanDelay, setMaxScanDelay] = useState("");
  const [scanDelay, setScanDelay] = useState("");

  const [hostTimeoutEnabled, setHostTimeoutEnabled] = useState(false);
  const [maxRttTimeoutEnabled, setMaxRttTimeoutEnabled] = useState(false);
  const [minRttTimeoutEnabled, setMinRttTimeoutEnabled] = useState(false);
  const [initialRttTimeoutEnabled, setInitialRttTimeoutEnabled] = useState(false);
  const [maxHostGroupEnabled, setMaxHostGroupEnabled] = useState(false);
  const [minHostGroupEnabled, setMinHostGroupEnabled] = useState(false);
  const [maxParallelismEnabled, setMaxParallelismEnabled] = useState(false);
  const [minParallelismEnabled, setMinParallelismEnabled] = useState(false);
  const [maxScanDelayEnabled, setMaxScanDelayEnabled] = useState(false);
  const [scanDelayEnabled, setScanDelayEnabled] = useState(false);

  // Update timing options whenever any field changes
  useEffect(() => {
    const options = [];

    if (hostTimeoutEnabled && hostTimeout) options.push(`--host-timeout ${hostTimeout}`);
    if (maxRttTimeoutEnabled && maxRttTimeout) options.push(`--max-rtt-timeout ${maxRttTimeout}`);
    if (minRttTimeoutEnabled && minRttTimeout) options.push(`--min-rtt-timeout ${minRttTimeout}`);
    if (initialRttTimeoutEnabled && initialRttTimeout) options.push(`--initial-rtt-timeout ${initialRttTimeout}`);
    if (maxHostGroupEnabled && maxHostGroup) options.push(`--max-hostgroup ${maxHostGroup}`);
    if (minHostGroupEnabled && minHostGroup) options.push(`--min-hostgroup ${minHostGroup}`);
    if (maxParallelismEnabled && maxParallelism) options.push(`--max-parallelism ${maxParallelism}`);
    if (minParallelismEnabled && minParallelism) options.push(`--min-parallelism ${minParallelism}`);
    if (maxScanDelayEnabled && maxScanDelay) options.push(`--max-scan-delay ${maxScanDelay}`);
    if (scanDelayEnabled && scanDelay) options.push(`--scan-delay ${scanDelay}`);

    setTimingOptions(options.join(" ").trim());
  }, [
    hostTimeout, maxRttTimeout, minRttTimeout, initialRttTimeout, maxHostGroup, minHostGroup,
    maxParallelism, minParallelism, maxScanDelay, scanDelay, 
    hostTimeoutEnabled, maxRttTimeoutEnabled, minRttTimeoutEnabled, initialRttTimeoutEnabled, 
    maxHostGroupEnabled, minHostGroupEnabled, maxParallelismEnabled, minParallelismEnabled,
    maxScanDelayEnabled, scanDelayEnabled, setTimingOptions
  ]);

  return (
    <div className="space-y-4">
      {/* Max time to scan a target */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="hostTimeoutEnabled"
          checked={hostTimeoutEnabled}
          onCheckedChange={(checked) => setHostTimeoutEnabled(checked as boolean)}
        />
        <Label htmlFor="hostTimeout" className="whitespace-nowrap flex-shrink-0">Max time to scan a target (--host-timeout)</Label>
        <Input
          id="hostTimeout"
          value={hostTimeout}
          onChange={(e) => setHostTimeout(e.target.value)}
          disabled={!hostTimeoutEnabled}
          placeholder="Enter timeout"
        />
      </div>

      {/* Max probe timeout */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="maxRttTimeoutEnabled"
          checked={maxRttTimeoutEnabled}
          onCheckedChange={(checked) => setMaxRttTimeoutEnabled(checked as boolean)}
        />
        <Label htmlFor="maxRttTimeout" className="whitespace-nowrap flex-shrink-0">Max probe timeout (--max-rtt-timeout)</Label>
        <Input
          id="maxRttTimeout"
          value={maxRttTimeout}
          onChange={(e) => setMaxRttTimeout(e.target.value)}
          disabled={!maxRttTimeoutEnabled}
          placeholder="Enter max RTT timeout"
        />
      </div>

      {/* Min probe timeout */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="minRttTimeoutEnabled"
          checked={minRttTimeoutEnabled}
          onCheckedChange={(checked) => setMinRttTimeoutEnabled(checked as boolean)}
        />
        <Label htmlFor="minRttTimeout" className="whitespace-nowrap flex-shrink-0">Min probe timeout (--min-rtt-timeout)</Label>
        <Input
          id="minRttTimeout"
          value={minRttTimeout}
          onChange={(e) => setMinRttTimeout(e.target.value)}
          disabled={!minRttTimeoutEnabled}
          placeholder="Enter min RTT timeout"
        />
      </div>

      {/* Initial probe timeout */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="initialRttTimeoutEnabled"
          checked={initialRttTimeoutEnabled}
          onCheckedChange={(checked) => setInitialRttTimeoutEnabled(checked as boolean)}
        />
        <Label htmlFor="initialRttTimeout" className="whitespace-nowrap flex-shrink-0">Initial probe timeout (--initial-rtt-timeout)</Label>
        <Input
          id="initialRttTimeout"
          value={initialRttTimeout}
          onChange={(e) => setInitialRttTimeout(e.target.value)}
          disabled={!initialRttTimeoutEnabled}
          placeholder="Enter initial RTT timeout"
        />
      </div>

      {/* Max hosts in parallel */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="maxHostGroupEnabled"
          checked={maxHostGroupEnabled}
          onCheckedChange={(checked) => setMaxHostGroupEnabled(checked as boolean)}
        />
        <Label htmlFor="maxHostGroup" className="whitespace-nowrap flex-shrink-0">Max hosts in parallel (--max-hostgroup)</Label>
        <Input
          id="maxHostGroup"
          value={maxHostGroup}
          onChange={(e) => setMaxHostGroup(e.target.value)}
          disabled={!maxHostGroupEnabled}
          placeholder="Enter max host group"
        />
      </div>

      {/* Min hosts in parallel */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="minHostGroupEnabled"
          checked={minHostGroupEnabled}
          onCheckedChange={(checked) => setMinHostGroupEnabled(checked as boolean)}
        />
        <Label htmlFor="minHostGroup" className="whitespace-nowrap flex-shrink-0">Min hosts in parallel (--min-hostgroup)</Label>
        <Input
          id="minHostGroup"
          value={minHostGroup}
          onChange={(e) => setMinHostGroup(e.target.value)}
          disabled={!minHostGroupEnabled}
          placeholder="Enter min host group"
        />
      </div>

      {/* Max outstanding probes */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="maxParallelismEnabled"
          checked={maxParallelismEnabled}
          onCheckedChange={(checked) => setMaxParallelismEnabled(checked as boolean)}
        />
        <Label htmlFor="maxParallelism" className="whitespace-nowrap flex-shrink-0">Max outstanding probes (--max-parallelism)</Label>
        <Input
          id="maxParallelism"
          value={maxParallelism}
          onChange={(e) => setMaxParallelism(e.target.value)}
          disabled={!maxParallelismEnabled}
          placeholder="Enter max parallelism"
        />
      </div>

      {/* Min outstanding probes */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="minParallelismEnabled"
          checked={minParallelismEnabled}
          onCheckedChange={(checked) => setMinParallelismEnabled(checked as boolean)}
        />
        <Label htmlFor="minParallelism" className="whitespace-nowrap flex-shrink-0">Min outstanding probes (--min-parallelism)</Label>
        <Input
          id="minParallelism"
          value={minParallelism}
          onChange={(e) => setMinParallelism(e.target.value)}
          disabled={!minParallelismEnabled}
          placeholder="Enter min parallelism"
        />
      </div>

      {/* Max scan delay */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="maxScanDelayEnabled"
          checked={maxScanDelayEnabled}
          onCheckedChange={(checked) => setMaxScanDelayEnabled(checked as boolean)}
        />
        <Label htmlFor="maxScanDelay" className="whitespace-nowrap flex-shrink-0">Max scan delay (--max-scan-delay)</Label>
        <Input
          id="maxScanDelay"
          value={maxScanDelay}
          onChange={(e) => setMaxScanDelay(e.target.value)}
          disabled={!maxScanDelayEnabled}
          placeholder="Enter max scan delay"
        />
      </div>

      {/* Min delay between probes */}
      <div className="flex items-center space-x-2 w-full">
        <Checkbox
          id="scanDelayEnabled"
          checked={scanDelayEnabled}
          onCheckedChange={(checked) => setScanDelayEnabled(checked as boolean)}
        />
        <Label htmlFor="scanDelay" className="whitespace-nowrap flex-shrink-0">Min delay between probes (--scan-delay)</Label>
        <Input
          id="scanDelay"
          value={scanDelay}
          onChange={(e) => setScanDelay(e.target.value)}
          disabled={!scanDelayEnabled}
          placeholder="Enter scan delay"
        />
      </div>
    </div>
  );
}
