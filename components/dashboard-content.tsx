"use client"

import { useState } from "react"
import { PopularRoutesCard } from "@/components/cards/popular-routes-card"
import { PriceTrendsCard } from "@/components/cards/price-trends-card"
import { HighDemandCard } from "@/components/cards/high-demand-card"
import { InsightsCard } from "@/components/cards/insights-card"
import { FiltersPanel } from "@/components/filters-panel"
import { InteractiveMap } from "@/components/interactive-map"
import { UploadCard } from "@/components/upload-card"
import { LiveRadar } from "@/components/live-radar"

export function DashboardContent() {
  const [filters, setFilters] = useState({
    origin: "",
    destination: "",
    dateRange: { from: null, to: null },
  })

  return (
    <div className="space-y-6">
      {/* Live Radar */}
      <LiveRadar />

      {/* Filters Panel */}
      <FiltersPanel filters={filters} onFiltersChange={setFilters} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <PopularRoutesCard />
        <PriceTrendsCard />
        <HighDemandCard />
        <InsightsCard />
      </div>

      {/* Interactive Map */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <InteractiveMap />
        </div>
        <div>
          <UploadCard />
        </div>
      </div>
    </div>
  )
}
