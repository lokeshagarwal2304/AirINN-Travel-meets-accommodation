"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, Mic, Search } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

const cities = [
  "Sydney (SYD)",
  "Melbourne (MEL)",
  "Brisbane (BNE)",
  "Perth (PER)",
  "Adelaide (ADL)",
  "Gold Coast (OOL)",
  "Cairns (CNS)",
  "Darwin (DRW)",
]

interface FiltersProps {
  filters: {
    origin: string
    destination: string
    dateRange: DateRange | undefined
  }
  onFiltersChange: (filters: any) => void
}

export function FiltersPanel({ filters, onFiltersChange }: FiltersProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const handleFetchTrends = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleVoiceInput = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      // Mock voice input result
      onFiltersChange({
        ...filters,
        origin: "Sydney (SYD)",
        destination: "Melbourne (MEL)",
      })
    }, 3000)
  }

  return (
    <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Origin City</label>
            <Select value={filters.origin} onValueChange={(value) => onFiltersChange({ ...filters, origin: value })}>
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="text-white hover:bg-slate-700">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Destination City</label>
            <Select
              value={filters.destination}
              onValueChange={(value) => onFiltersChange({ ...filters, destination: value })}
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="text-white hover:bg-slate-700">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} - {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(range) => onFiltersChange({ ...filters, dateRange: range })}
                  numberOfMonths={2}
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Voice Input</label>
            <Button
              onClick={handleVoiceInput}
              disabled={isListening}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {isListening ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Voice Search
                </>
              )}
            </Button>
          </div>
        </div>

        <Button
          onClick={handleFetchTrends}
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-8 py-2 h-10 shimmer-effect"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />🔍 Fetch Trends
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
