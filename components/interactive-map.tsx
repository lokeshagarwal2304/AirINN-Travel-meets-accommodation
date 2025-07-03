"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane } from "lucide-react"

const mockRoutes = [
  { from: "Sydney", to: "Melbourne", bookings: 1247, x: 70, y: 75, toX: 65, toY: 85 },
  { from: "Brisbane", to: "Sydney", bookings: 892, x: 75, y: 45, toX: 70, toY: 75 },
  { from: "Perth", to: "Melbourne", bookings: 743, x: 15, y: 70, toX: 65, toY: 85 },
  { from: "Adelaide", to: "Sydney", bookings: 621, x: 55, y: 85, toX: 70, toY: 75 },
]

export function InteractiveMap() {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          🗺️ Interactive Route Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
          {/* Australia outline placeholder */}
          <div className="absolute inset-4 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600">
            <div className="absolute top-4 left-4 text-slate-500 text-sm">Australia Map Placeholder</div>

            {/* Route lines */}
            {mockRoutes.map((route, index) => (
              <div key={index} className="absolute inset-0">
                <svg className="w-full h-full">
                  <line
                    x1={`${route.x}%`}
                    y1={`${route.y}%`}
                    x2={`${route.toX}%`}
                    y2={`${route.toY}%`}
                    stroke="url(#routeGradient)"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Origin point */}
                <div
                  className="absolute w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2 hover:scale-125 transition-transform cursor-pointer group"
                  style={{ left: `${route.x}%`, top: `${route.y}%` }}
                >
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {route.from}
                    </div>
                  </div>
                </div>

                {/* Destination point */}
                <div
                  className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2 hover:scale-125 transition-transform cursor-pointer group"
                  style={{ left: `${route.toX}%`, top: `${route.toY}%` }}
                >
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {route.to} - {route.bookings} bookings
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Route legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {mockRoutes.map((route, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded text-sm">
              <div className="flex items-center gap-2">
                <Plane className="w-3 h-3 text-cyan-400" />
                <span className="text-slate-300">
                  {route.from} → {route.to}
                </span>
              </div>
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs">{route.bookings}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
