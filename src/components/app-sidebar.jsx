import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
  } from "@/components/ui/sidebar"
  import Link from "next/link";
  import { Button } from "./ui/button";
  import { Calendar, Home, Inbox, Search, Settings,LogOut } from "lucide-react";
  
  const items = [
    {
      title: "Home",
      url: "/meeting",
      icon: Home,
    },
    {
      title: "Call History",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Notifications",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    ,
    {
      title: "Log Out",
      url: "/",
      icon: LogOut,
    }
  ]
  export function AppSidebar() {
    return (
      <Sidebar className="bg-slate-400 ">
        <SidebarHeader>Navigation Bar</SidebarHeader>
        <SidebarContent>
          <SidebarGroup />
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                    
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }
  