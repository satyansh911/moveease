"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrafficCone, Plus, RefreshCw } from "lucide-react"

type Signal = {
  id: string
  name: string
  location: string
  currentState: "Red" | "Yellow" | "Green"
  mode: "Auto" | "Manual" | "Maintenance"
  timing: {
    red: number
    yellow: number
    green: number
  }
  lastUpdated: string
}

type SignalForm = {
  name: string
  location: string
  timing: {
    red: number
    yellow: number
    green: number
  }
}

export function SignalControlPanel() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [selectedSignal, setSelectedSignal] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [form, setForm] = useState<SignalForm>({
    name: "",
    location: "",
    timing: { red: 30, yellow: 5, green: 25 },
  })

  async function fetchSignals() {
    setLoading(true)
    try {
      const res = await fetch("/api/signals")
      const data = await res.json()
      setSignals(data)
      if (data.length > 0 && !selectedSignal) {
        setSelectedSignal(data[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch signals:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateSignalState(state: "Red" | "Yellow" | "Green") {
    if (!selectedSignal) return

    try {
      const res = await fetch(`/api/signals/${selectedSignal}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentState: state }),
      })
      if (res.ok) {
        fetchSignals()
      }
    } catch (error) {
      console.error("Failed to update signal:", error)
    }
  }

  async function updateSignalMode(mode: "Auto" | "Manual" | "Maintenance") {
    if (!selectedSignal) return

    try {
      const res = await fetch(`/api/signals/${selectedSignal}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      })
      if (res.ok) {
        fetchSignals()
      }
    } catch (error) {
      console.error("Failed to update signal mode:", error)
    }
  }

  async function addSignal() {
    if (!form.name.trim() || !form.location.trim()) return

    try {
      const res = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setForm({ name: "", location: "", timing: { red: 30, yellow: 5, green: 25 } })
        setAddDialogOpen(false)
        fetchSignals()
      }
    } catch (error) {
      console.error("Failed to add signal:", error)
    }
  }

  useEffect(() => {
    fetchSignals()
  }, [])

  const currentSignal = signals.find((s) => s.id === selectedSignal)

  return (
    <section id="signals" aria-label="Signal controls">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrafficCone className="h-5 w-5 text-emerald-600" />
            Signal Control
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSignals}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Signal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Traffic Signal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Signal Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Main & 5th Street"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="Intersection coordinates or address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Timing (seconds)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="red" className="text-xs">
                          Red
                        </Label>
                        <Input
                          id="red"
                          type="number"
                          value={form.timing.red}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              timing: { ...f.timing, red: Number.parseInt(e.target.value) || 0 },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="yellow" className="text-xs">
                          Yellow
                        </Label>
                        <Input
                          id="yellow"
                          type="number"
                          value={form.timing.yellow}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              timing: { ...f.timing, yellow: Number.parseInt(e.target.value) || 0 },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="green" className="text-xs">
                          Green
                        </Label>
                        <Input
                          id="green"
                          type="number"
                          value={form.timing.green}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              timing: { ...f.timing, green: Number.parseInt(e.target.value) || 0 },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addSignal} className="bg-emerald-600 hover:bg-emerald-700">
                    Add Signal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {signals.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              {loading ? "Loading signals..." : "No signals configured. Add one to get started."}
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Select Signal</Label>
                <Select value={selectedSignal} onValueChange={setSelectedSignal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select signal to control" />
                  </SelectTrigger>
                  <SelectContent>
                    {signals.map((signal) => (
                      <SelectItem key={signal.id} value={signal.id}>
                        {signal.name} - {signal.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentSignal && currentSignal.timing && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Mode:</span>
                      <Select value={currentSignal.mode} onValueChange={updateSignalMode}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Auto">Auto</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Badge variant={currentSignal.mode === "Auto" ? "default" : "secondary"}>
                      {currentSignal.mode}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-8 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`h-12 w-12 rounded-full border-4 ${
                          currentSignal.currentState === "Red"
                            ? "bg-red-600 border-red-300 shadow-lg shadow-red-200"
                            : "bg-red-200/60 border-red-200"
                        }`}
                        aria-label="Red light"
                      />
                      <span className="text-xs text-muted-foreground">{currentSignal?.timing?.red || 0}s</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`h-12 w-12 rounded-full border-4 ${
                          currentSignal.currentState === "Yellow"
                            ? "bg-amber-500 border-amber-300 shadow-lg shadow-amber-200"
                            : "bg-amber-200/60 border-amber-200"
                        }`}
                        aria-label="Yellow light"
                      />
                      <span className="text-xs text-muted-foreground">{currentSignal?.timing?.yellow || 0}s</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span
                        className={`h-12 w-12 rounded-full border-4 ${
                          currentSignal.currentState === "Green"
                            ? "bg-emerald-600 border-emerald-300 shadow-lg shadow-emerald-200"
                            : "bg-emerald-200/60 border-emerald-200"
                        }`}
                        aria-label="Green light"
                      />
                      <span className="text-xs text-muted-foreground">{currentSignal?.timing?.green || 0}s</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={currentSignal.currentState === "Red" ? "default" : "outline"}
                      onClick={() => updateSignalState("Red")}
                      disabled={currentSignal.mode !== "Manual"}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Red
                    </Button>
                    <Button
                      variant={currentSignal.currentState === "Yellow" ? "default" : "outline"}
                      onClick={() => updateSignalState("Yellow")}
                      disabled={currentSignal.mode !== "Manual"}
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Yellow
                    </Button>
                    <Button
                      variant={currentSignal.currentState === "Green" ? "default" : "outline"}
                      onClick={() => updateSignalState("Green")}
                      disabled={currentSignal.mode !== "Manual"}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Green
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Last updated: {new Date(currentSignal.lastUpdated).toLocaleString()}
                    {currentSignal.mode !== "Manual" && (
                      <div className="mt-1">Switch to Manual mode to control signals</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
