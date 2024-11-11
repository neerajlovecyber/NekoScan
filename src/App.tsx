import "./App.css";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider,SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./components/mode-toggle";
import { Settings } from "@/components/Settings";
import { Profiles } from "@/components/Profiles";
import { useState } from "react";
import { Home } from "./components/Home";

function App() {
  const [activePage, setActivePage] = useState<string>("Home");

  const handlePageChange = (page: string) => {
    setActivePage(page); // Update the active page state
  };

  return (
    <SidebarProvider>
      <AppSidebar onPageChange={handlePageChange} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between pr-4">
          <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">NekoScan</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activePage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="">
            {/* Conditional content rendering */}
            {activePage === "Home" && <Home />}
            {activePage === "Profiles" && <Profiles />}
            {activePage === "Settings" && <Settings />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
