"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, Activity, Siren, Camera } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type Metric = {
  label: string
  value: string
  change: string
  icon: React.ReactNode
  footer?: React.ReactNode
}

export function KpiCards({
  metrics = [
    {
      label: "Avg Speed",
      value: "38 km/h",
      change: "+4%",
      icon: <Gauge className="h-4 w-4 text-emerald-600" />,
      footer: <Progress value={62} />,
    },
    {
      label: "Incidents Today",
      value: "12",
      change: "-3",
      icon: <Siren className="h-4 w-4 text-amber-600" />,
    },
    {
      label: "Congestion Level",
      value: "56%",
      change: "-5%",
      icon: <Activity className="h-4 w-4 text-rose-600" />,
      footer: <Progress value={56} />,
    },
    {
      label: "Cameras Online",
      value: "184 / 192",
      change: "+2",
      icon: <Camera className="h-4 w-4 text-zinc-700" />,
    },
  ] as Metric[],
}: {
  metrics?: Metric[]
}) {
  return (
    <section aria-label="Key metrics">
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
