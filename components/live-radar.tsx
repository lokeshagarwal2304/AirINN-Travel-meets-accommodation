"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap } from "lucide-react"

const mockSurges = [
  { route: "BNE → MEL", change: "+34%", type: "surge" },
  { route: "SYD → PER", change: "+28%", type: "surge" },
  { route: "ADL → BNE", change: "-15%", type: "drop" },
]

export function LiveRadar() {
  const [currentSurge, setCurrentSurge] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSurge((prev) => (prev + 1) % mockSurges.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const surge = mockSurges[currentSurge]

  return (
    <div className="bg-gradient-to-r from-slate-900/80 to-indigo-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <span className="text-white font-medium">📡 Live Booking Radar</span>
        </div>

        <div className="flex items-center gap-4">
          <Badge
            className={`${
              surge.type === "surge"
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-red-500/20 text-red-400 border-red-500/30"
            } animate-pulse`}
          >
            {surge.type === "surge" ? (
              <>
                <TrendingUp className="w-3 h-3 mr-1" />🟢 Surge: {surge.route} up {surge.change}!
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 mr-1" />🔴 Drop: {surge.route} down {surge.change}
              </>
            )}
          </Badge>

          <div className="text-slate-400 text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  )
}
