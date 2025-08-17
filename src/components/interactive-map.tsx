"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Camera, TrafficCone, RefreshCw } from "lucide-react"

type MapData = {
  incidents: Array<{
    id: string
    type: string
    location: string
    severity: "Low" | "Medium" | "High" | "Critical"
    status: string
  }>
  signals: Array<{
    id: string
    name: string
    location: string
    currentState: "Red" | "Yellow" | "Green"
  }>
  cameras: Array<{
    id: string
    name: string
    status: "Online" | "Offline"
  }>
  trafficData: Array<{
    location: string
    avgSpeed: number
    congestionLevel: number
  }>
}

export function InteractiveMap() {
  const [mapData, setMapData] = useState<MapData>({
    incidents: [],
    signals: [],
    cameras: [],
    trafficData: [],
  })
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  async function fetchMapData() {
    setLoading(true)
    try {
      const [incidentsRes, signalsRes, camerasRes, trafficRes] = await Promise.all([
        fetch("/api/incidents"),
        fetch("/api/signals"),
        fetch("/api/cameras"),
        fetch("/api/traffic-data"),
      ])

      const [incidents, signals, cameras, trafficData] = await Promise.all([
        incidentsRes.json(),
        signalsRes.json(),
        camerasRes.json(),
        trafficRes.json(),
      ])

      setMapData({ incidents, signals, cameras, trafficData })
    } catch (error) {
      console.error("Failed to fetch map data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMapData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMapData, 30000)
    return () => clearInterval(interval)
  }, [])

  const stats = {
    corridors: 42,
    avgFlow: Math.round(
      mapData.trafficData.reduce((sum, d) => sum + d.avgSpeed * 20, 0) / Math.max(mapData.trafficData.length, 1),
    ),
    bottlenecks: mapData.trafficData.filter((d) => d.congestionLevel > 70).length,
    etaVariance: Math.round(
      (mapData.trafficData.reduce((sum, d) => sum + d.congestionLevel, 0) / Math.max(mapData.trafficData.length, 1)) *
        0.2,
    ),
  }

  return (
    <section id="map" aria-label="Live traffic map">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            City Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Live</Badge>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="incidents">Incidents</SelectItem>
                <SelectItem value="signals">Signals</SelectItem>
                <SelectItem value="cameras">Cameras</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMapData}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden rounded-lg border bg-slate-50">
            <img
              src="/interactive-city-traffic-map.png"
              alt="Interactive traffic map"
              className="aspect-[16/9] w-full object-cover"
            />

            {/* Map Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Incidents */}
              {(filter === "all" || filter === "incidents") &&
                mapData.incidents.map((incident, i) => (
                  <div
                    key={incident.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${20 + ((i * 15) % 60)}%`,
                      top: `${30 + ((i * 10) % 40)}%`,
                    }}
                  >
                    <div className="relative group">
                      <div
                        className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                          incident.severity === "Critical"
                            ? "bg-red-600"
                            : incident.severity === "High"
                              ? "bg-orange-500"
                              : incident.severity === "Medium"
                                ? "bg-amber-500"
                                : "bg-yellow-400"
                        }`}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {incident.type} - {incident.location}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Signals */}
              {(filter === "all" || filter === "signals") &&
                mapData.signals.map((signal, i) => (
                  <div
                    key={signal.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${25 + ((i * 20) % 50)}%`,
                      top: `${20 + ((i * 15) % 60)}%`,
                    }}
                  >
                    <div className="relative group">
                      <TrafficCone
                        className={`w-4 h-4 ${
                          signal.currentState === "Red"
                            ? "text-red-600"
                            : signal.currentState === "Yellow"
                              ? "text-amber-500"
                              : "text-emerald-600"
                        }`}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {signal.name} - {signal.currentState}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Cameras */}
              {(filter === "all" || filter === "cameras") &&
                mapData.cameras.map((camera, i) => (
                  <div
                    key={camera.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${30 + ((i * 18) % 40)}%`,
                      top: `${25 + ((i * 12) % 50)}%`,
                    }}
                  >
                    <div className="relative group">
                      <Camera
                        className={`w-4 h-4 ${camera.status === "Online" ? "text-emerald-600" : "text-red-600"}`}
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {camera.name} - {camera.status}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span>Critical Incidents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Medium Incidents</span>
            </div>
            <div className="flex items-center gap-2">
              <TrafficCone className="w-4 h-4 text-emerald-600" />
              <span>Traffic Signals</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Active Cameras</span>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Corridors</div>
              <div className="text-lg font-semibold">{stats.corridors} monitored</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Avg Flow</div>
              <div className="text-lg font-semibold">{stats.avgFlow} veh/hr</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">Bottlenecks</div>
              <div className="text-lg font-semibold">{stats.bottlenecks} active</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-muted-foreground">ETA Variance</div>
              <div className="text-lg font-semibold">{stats.etaVariance}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
