"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Siren, OctagonAlert, RefreshCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlertDialog, type AlertForm } from "./alert-dialog"

type AlertItem = {
  id: string
  title: string
  detail: string
  level: "Advisory" | "Warning" | "Critical"
  time: string
}

function LevelIcon({ level }: { level: AlertItem["level"] }) {
  if (level === "Critical") return <OctagonAlert className="h-4 w-4 text-rose-600" />
  if (level === "Warning") return <AlertTriangle className="h-4 w-4 text-amber-600" />
  return <Siren className="h-4 w-4 text-emerald-700" />
}

export function AlertsList() {
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchAlerts() {
    setLoading(true)
    try {
      const res = await fetch("/api/alerts")
      const data = await res.json()
      setAlerts(data)
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  async function addAlert(payload: AlertForm) {
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      fetchAlerts()
    }
  }

  async function dismissAlert(id: string) {
    const res = await fetch(`/api/alerts/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      fetchAlerts()
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  return (
    <section aria-label="Active alerts">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alerts</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAlerts}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <AlertDialog onCreate={addAlert} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {alerts.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              {loading ? "Loading alerts..." : "No active alerts"}
            </div>
          ) : (
            alerts.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
                <LevelIcon level={a.level} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.detail}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(a.time).toLocaleTimeString()}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(a.id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  )
}
