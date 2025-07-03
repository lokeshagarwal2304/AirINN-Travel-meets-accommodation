"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigation } from "@/components/top-navigation"
import { DashboardContent } from "@/components/dashboard-content"
import { AirBotChat } from "@/components/airbot-chat"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopNavigation />
            <main className="flex-1 p-6">
              <DashboardContent />
            </main>
          </div>
        </div>
        <AirBotChat />
      </SidebarProvider>
    </div>
  )
}
