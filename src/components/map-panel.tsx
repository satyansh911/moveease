"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Filter } from "lucide-react"

export function MapPanel() {
  return (
    <section id="map" aria-label="Live traffic map">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>City Map</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Live</Badge>
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-3 flex items-center gap-2">
            <Input placeholder="Search corridor or intersection..." />
            <Button variant="outline" size="sm">
              Apply
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <img
              src="/interactive-city-traffic-map.png"
              alt="Interactive traffic map"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Corridors</div>
              <div className="text-lg font-semibold">42 monitored</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Avg Flow</div>
              <div className="text-lg font-semibold">1,280 veh/hr</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Bottlenecks</div>
              <div className="text-lg font-semibold">6 active</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">ETA Variance</div>
              <div className="text-lg font-semibold">12%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
