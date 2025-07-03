"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign } from "lucide-react"

const mockData = [
  { day: "Mon", price: 245 },
  { day: "Tue", price: 289 },
  { day: "Wed", price: 234 },
  { day: "Thu", price: 312 },
  { day: "Fri", price: 398 },
  { day: "Sat", price: 445 },
  { day: "Sun", price: 367 },
]

export function PriceTrendsCard() {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          📈 Price Trends (7-Day Avg)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                formatter={(value) => [`$${value}`, "Average Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="url(#priceGradient)"
                strokeWidth={3}
                dot={{ fill: "#06B6D4", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#06B6D4" }}
              />
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-slate-400">Weekly Average</span>
          <span className="text-green-400 font-semibold">$327</span>
        </div>
      </CardContent>
    </Card>
  )
}
