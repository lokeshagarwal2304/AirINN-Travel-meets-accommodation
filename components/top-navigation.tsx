"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopNavigation() {
  return (
    <header className="h-16 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white hover:bg-slate-800" />
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
            ✈️ AirPulse – Airline Demand Monitor
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Avatar className="w-8 h-8 ring-2 ring-indigo-500/50">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback className="bg-indigo-600 text-white text-xs">AM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
