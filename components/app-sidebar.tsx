"use client"

import { BarChart3, Bot, LayoutDashboardIcon as Dashboard, Settings, TrendingUp, Upload, Zap } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: Dashboard,
    url: "#dashboard",
    isActive: true,
  },
  {
    title: "Explore Trends",
    icon: TrendingUp,
    url: "#trends",
  },
  {
    title: "Upload CSV",
    icon: Upload,
    url: "#upload",
  },
  {
    title: "Predictions (AI)",
    icon: Zap,
    url: "#predictions",
  },
  {
    title: "Chat with AirBot 🤖",
    icon: Bot,
    url: "#chat",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#settings",
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-indigo-900/50 to-slate-900/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">AirPulse</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="text-slate-300 hover:text-white hover:bg-indigo-800/30 data-[active=true]:bg-indigo-600/40 data-[active=true]:text-white transition-all duration-200"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
