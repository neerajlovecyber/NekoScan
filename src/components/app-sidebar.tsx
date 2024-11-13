
import * as React from "react";
import { Bot, Settings2, SquareTerminal } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CatIcon } from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      logo: CatIcon,
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/Home",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Profiles",
      url: "/profiles",
      icon: Bot,
      isActive: false,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      isActive: false,
    },
  ],
};

export function AppSidebar({ onPageChange, ...props }: React.ComponentProps<typeof Sidebar> & { onPageChange: (page: string) => void }) {
  const [activeItem, setActiveItem] = React.useState<string>("Home");

  const handleItemClick = (page: string) => {
    setActiveItem(page); // Set active page
    onPageChange(page);   // Propagate to the parent component
  };

  return (
    <Sidebar collapsible="icon" {...props} className="bg-background">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={activeItem === item.title} // Ensure collapsible menu updates dynamically
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      onClick={() => handleItemClick(item.title)} // Trigger page change
                      className={activeItem === item.title ? "bg-muted" : ""} // Highlight active item
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
