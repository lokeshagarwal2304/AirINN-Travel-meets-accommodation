"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Lightbulb, TrendingUp } from "lucide-react"

const mockInsights = [
  {
    type: "trend",
    title: "Holiday Surge Detected",
    description: "Bookings increase 340% during Christmas week across all major routes.",
    confidence: "High",
    impact: "Critical",
  },
  {
    type: "price",
    title: "Weekend Premium",
    description: "Friday-Sunday flights command 25% higher prices on SYD-MEL route.",
    confidence: "Medium",
    impact: "Moderate",
  },
  {
    type: "opportunity",
    title: "Emerging Route",
    description: "BNE-ADL showing 45% growth - consider targeting this market.",
    confidence: "High",
    impact: "High",
  },
]

export function InsightsCard() {
  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Brain className="w-4 h-4 text-white" />
          </div>
          🧠 GPT-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockInsights.map((insight, index) => (
          <div key={index} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium text-sm">{insight.title}</span>
              </div>
              <Badge
                className={`text-xs ${
                  insight.impact === "Critical"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : insight.impact === "High"
                      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                }`}
              >
                {insight.impact}
              </Badge>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{insight.description}</p>
            <div className="flex items-center justify-between mt-2">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs">
                {insight.confidence} Confidence
              </Badge>
              <TrendingUp className="w-3 h-3 text-green-400" />
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
          <div className="text-purple-400 text-xs font-medium">
            💡 AI Recommendation: Focus marketing on BNE-ADL route during weekdays for maximum ROI
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
