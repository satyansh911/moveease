"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Siren, Shield, CarFront, Bike, Truck, UserCog } from "lucide-react"
import { UnitDialog, type UnitForm } from "./unit-dialog"

type UnitStatus = "Available" | "En Route" | "On Scene" | "Unavailable"

type Unit = {
  id: string
  name: string
  type: "Patrol Car" | "Motorbike" | "Tow Truck" | "Supervisor"
  status: UnitStatus
  location: string
}

type Incident = {
  id: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  location: string
  status: "Open" | "In Progress" | "Cleared"
}

function UnitIcon({ type }: { type: Unit["type"] }) {
  if (type === "Patrol Car") return <CarFront className="h-4 w-4 text-emerald-700" />
  if (type === "Motorbike") return <Bike className="h-4 w-4 text-emerald-700" />
  if (type === "Tow Truck") return <Truck className="h-4 w-4 text-emerald-700" />
  return <UserCog className="h-4 w-4 text-emerald-700" />
}

export function DispatchPanel() {
  const [units, setUnits] = useState<Unit[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [assignUnitId, setAssignUnitId] = useState<string | null>(null)
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const [uRes, iRes] = await Promise.all([fetch("/api/units"), fetch("/api/incidents")])
      setUnits(await uRes.json())
      setIncidents(await iRes.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openIncidents = useMemo(
    () => incidents.filter((i) => i.status === "Open" || i.status === "In Progress"),
    [incidents],
  )

  async function addUnit(payload: UnitForm) {
    const res = await fetch("/api/units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      load()
    }
  }

  async function updateUnitStatus(id: string, status: UnitStatus) {
    const res = await fetch("/api/units", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      load()
    }
  }

  async function assignIncidentToUnit() {
    if (!assignUnitId || !selectedIncidentId) return
    const unit = units.find((u) => u.id === assignUnitId)
    if (!unit) return
    // Patch the incident to attach unit and set In Progress
    const res = await fetch(`/api/incidents/${selectedIncidentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignedUnitId: unit.id,
        assignedUnitName: unit.name,
        status: "In Progress",
      }),
    })
    if (res.ok) {
      // Move unit to "En Route"
      await updateUnitStatus(unit.id, "En Route")
      setAssignUnitId(null)
      setSelectedIncidentId(null)
      load()
    }
  }

  return (
    <section aria-label="Police dispatch and coordination">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-700" />
            Police Dispatch
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="bg-transparent">
              Refresh
            </Button>
            <UnitDialog onCreate={addUnit} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                      {loading ? "Loading units..." : "No units available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  units.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <UnitIcon type={u.type} />
                        <span>{u.type}</span>
                      </TableCell>
                      <TableCell>{u.location}</TableCell>
                      <TableCell>
                        <Select value={u.status} onValueChange={(v) => updateUnitStatus(u.id, v as UnitStatus)}>
                          <SelectTrigger className="h-8 w-[150px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="En Route">En Route</SelectItem>
                            <SelectItem value="On Scene">On Scene</SelectItem>
                            <SelectItem value="Unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={assignUnitId === u.id}
                          onOpenChange={(o) => {
                            setAssignUnitId(o ? u.id : null)
                            setSelectedIncidentId(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign incident</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-3">
                              <div className="text-sm text-muted-foreground">
                                Choose an incident to assign to {u.name}.
                              </div>
                              <Select value={selectedIncidentId ?? ""} onValueChange={setSelectedIncidentId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select incident" />
                                </SelectTrigger>
                                <SelectContent>
                                  {openIncidents.length === 0 ? (
                                    <div className="px-3 py-2 text-sm text-muted-foreground">No open incidents</div>
                                  ) : (
                                    openIncidents.map((i) => (
                                      <SelectItem key={i.id} value={i.id}>
                                        {i.type} — {i.location}{" "}
                                        <Badge variant="outline" className="ml-2">
                                          {i.severity}
                                        </Badge>
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setAssignUnitId(null)}>
                                Cancel
                              </Button>
                              <Button
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={assignIncidentToUnit}
                                disabled={!selectedIncidentId}
                              >
                                Dispatch
                                <Siren className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
