"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, Activity, Siren, Camera, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type KPIData = {
  avgSpeed: number
  incidentsToday: number
  congestionLevel: number
  camerasOnline: number
  camerasTotal: number
}

type Metric = {
  label: string
  value: string
  change: string
  icon: React.ReactNode
  footer?: React.ReactNode
}

export function RealtimeKpiCards() {
  const [kpiData, setKpiData] = useState<KPIData>({
    avgSpeed: 0,
    incidentsToday: 0,
    congestionLevel: 0,
    camerasOnline: 0,
    camerasTotal: 0,
  })
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  async function fetchKPIData() {
    setLoading(true)
    try {
      const res = await fetch("/api/kpi")
      const data = await res.json()
      setKpiData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Failed to fetch KPI data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKPIData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchKPIData, 30000)
    return () => clearInterval(interval)
  }, [])

  const metrics: Metric[] = [
    {
      label: "Avg Speed",
      value: `${Math.round(kpiData.avgSpeed)} km/h`,
      change: "+4%",
      icon: <Gauge className="h-4 w-4 text-emerald-600" />,
      footer: <Progress value={Math.min((kpiData.avgSpeed / 60) * 100, 100)} />,
    },
    {
      label: "Incidents Today",
      value: kpiData.incidentsToday.toString(),
      change: "-3",
      icon: <Siren className="h-4 w-4 text-amber-600" />,
    },
    {
      label: "Congestion Level",
      value: `${Math.round(kpiData.congestionLevel)}%`,
      change: "-5%",
      icon: <Activity className="h-4 w-4 text-rose-600" />,
      footer: <Progress value={kpiData.congestionLevel} />,
    },
    {
      label: "Cameras Online",
      value: `${kpiData.camerasOnline} / ${kpiData.camerasTotal}`,
      change: "+2",
      icon: <Camera className="h-4 w-4 text-zinc-700" />,
    },
  ]

  return (
    <section aria-label="Key metrics">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Real-time Metrics</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{m.label}</CardTitle>
              {m.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">Change: {m.change}</p>
              {m.footer ? <div className="mt-3">{m.footer}</div> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
