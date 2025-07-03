"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plane, TrendingUp } from "lucide-react"

const mockRoutes = [
  { route: "SYD ➝ MEL", bookings: 1247, change: "+12%" },
  { route: "MEL ➝ SYD", bookings: 1156, change: "+8%" },
  { route: "BNE ➝ SYD", bookings: 892, change: "+15%" },
  { route: "PER ➝ MEL", bookings: 743, change: "+5%" },
  { route: "ADL ➝ SYD", bookings: 621, change: "+22%" },
]

export function PopularRoutesCard() {
  const [animatedBookings, setAnimatedBookings] = useState(mockRoutes.map(() => 0))

  useEffect(() => {
    const timers = mockRoutes.map((route, index) => {
      return setTimeout(() => {
        const interval = setInterval(() => {
          setAnimatedBookings((prev) => {
            const newBookings = [...prev]
            if (newBookings[index] < route.bookings) {
              newBookings[index] = Math.min(newBookings[index] + Math.ceil(route.bookings / 50), route.bookings)
            }
            return newBookings
          })
        }, 50)

        setTimeout(() => clearInterval(interval), 2000)
      }, index * 200)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
            <Plane className="w-4 h-4 text-white" />
          </div>
          🔥 Top 5 Popular Routes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRoutes.map((route, index) => (
          <div
            key={route.route}
            className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <span className="text-slate-200 font-medium">{route.route}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{animatedBookings[index].toLocaleString()}</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                {route.change}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
