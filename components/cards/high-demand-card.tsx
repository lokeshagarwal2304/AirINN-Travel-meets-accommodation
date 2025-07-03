"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Flame } from "lucide-react"

const mockDemandData = [
  { date: "Dec 22", demand: "High", bookings: 1847, color: "bg-red-500" },
  { date: "Dec 23", demand: "Very High", bookings: 2156, color: "bg-red-600" },
  { date: "Dec 24", demand: "Extreme", bookings: 2834, color: "bg-red-700" },
  { date: "Dec 25", demand: "High", bookings: 1923, color: "bg-red-500" },
  { date: "Dec 26", demand: "Medium", bookings: 1234, color: "bg-yellow-500" },
  { date: "Dec 27", demand: "Low", bookings: 892, color: "bg-blue-500" },
]

export function HighDemandCard() {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          📅 High-Demand Periods
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockDemandData.map((item, index) => (
            <div key={item.date} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color} animate-pulse`} />
                <span className="text-slate-200 font-medium">{item.date}</span>
                <span className="text-xs text-slate-400">({item.demand})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{item.bookings.toLocaleString()}</span>
                {item.demand === "Extreme" && <Flame className="w-4 h-4 text-red-500" />}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <Flame className="w-4 h-4" />
            <span>Peak season detected: Dec 22-25</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
