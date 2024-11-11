import { CompletedScans } from "@/components/CompletedScans";
import { ActiveScans } from "@/components/RunningScans";
import { NewScan } from "@/components/NewScan"; 

// Profile.tsx
export function Home() {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-1w flex-col gap-4 p-4 pt-0 w-min">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <NewScan />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"><ActiveScans />
    </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"><CompletedScans /></div>
        </div>
      </div>
    );
  }
  
