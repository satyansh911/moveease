"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { CameraDialog, type CameraForm } from "./camera-dialog"

type CameraFeed = {
  id: string
  name: string
  status: "Online" | "Offline"
  img: string
}

export function CameraGrid() {
  const [feeds, setFeeds] = useState<CameraFeed[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchCameras() {
    setLoading(true)
    try {
      const res = await fetch("/api/cameras")
      const data = await res.json()
      setFeeds(data)
    } catch (error) {
      console.error("Failed to fetch cameras:", error)
    } finally {
      setLoading(false)
    }
  }

  async function addCamera(payload: CameraForm) {
    const res = await fetch("/api/cameras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      fetchCameras()
    }
  }

  async function updateCameraStatus(id: string, status: "Online" | "Offline") {
    const res = await fetch(`/api/cameras/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      fetchCameras()
    }
  }

  async function removeCamera(id: string) {
    if (!confirm("Are you sure you want to remove this camera?")) return

    const res = await fetch(`/api/cameras/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      fetchCameras()
    }
  }

  useEffect(() => {
    fetchCameras()
  }, [])

  return (
    <section id="cameras" aria-label="Camera feeds">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cameras</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCameras}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <CameraDialog onCreate={addCamera} />
          </div>
        </CardHeader>
        <CardContent>
          {feeds.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              {loading ? "Loading cameras..." : "No cameras available"}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {feeds.map((f) => (
                <div key={f.id} className="overflow-hidden rounded-lg border">
                  <img src={f.img || "/placeholder.svg"} alt={f.name} className="aspect-video w-full object-cover" />
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{f.name}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          f.status === "Online" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                        aria-label={`Status ${f.status}`}
                      >
                        {f.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCameraStatus(f.id, f.status === "Online" ? "Offline" : "Online")}
                        className="flex-1 text-xs"
                      >
                        {f.status === "Online" ? "Set Offline" : "Set Online"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCamera(f.id)}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
