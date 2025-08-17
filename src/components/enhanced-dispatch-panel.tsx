"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Siren, Shield, CarFront, Bike, Truck, UserCog, RefreshCw, Trash2, Users, MapPin } from "lucide-react"
import { UnitDialog, type UnitForm } from "./unit-dialog"
import { formatTimeAgo, severityColor } from "@/lib/traffic"

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
  reportedAt: string
  assignedUnitId?: string
  assignedUnitName?: string
}

type Assignment = {
  unitId: string
  unitName: string
  incidentId: string
  incidentType: string
  incidentSeverity: "Low" | "Medium" | "High" | "Critical"
  incidentLocation: string
  assignedAt: string
}

function UnitIcon({ type }: { type: Unit["type"] }) {
  if (type === "Patrol Car") return <CarFront className="h-4 w-4 text-emerald-700" />
  if (type === "Motorbike") return <Bike className="h-4 w-4 text-emerald-700" />
  if (type === "Tow Truck") return <Truck className="h-4 w-4 text-emerald-700" />
  return <UserCog className="h-4 w-4 text-emerald-700" />
}

function StatusBadge({ status }: { status: UnitStatus }) {
  const variants = {
    Available: "bg-emerald-100 text-emerald-800",
    "En Route": "bg-blue-100 text-blue-800",
    "On Scene": "bg-amber-100 text-amber-800",
    Unavailable: "bg-gray-100 text-gray-800",
  }

  return (
    <Badge className={variants[status]} variant="outline">
      {status}
    </Badge>
  )
}

export function EnhancedDispatchPanel() {
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

  const assignments = useMemo(() => {
    const activeAssignments: Assignment[] = []

    incidents.forEach((incident) => {
      if (incident.assignedUnitId && incident.assignedUnitName && incident.status === "In Progress") {
        activeAssignments.push({
          unitId: incident.assignedUnitId,
          unitName: incident.assignedUnitName,
          incidentId: incident.id,
          incidentType: incident.type,
          incidentSeverity: incident.severity,
          incidentLocation: incident.location,
          assignedAt: incident.reportedAt, // Using reportedAt as proxy for assignedAt
        })
      }
    })

    return activeAssignments
  }, [incidents])

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

  async function removeUnit(id: string) {
    if (!confirm("Are you sure you want to remove this unit?")) return

    const res = await fetch(`/api/units/${id}`, {
      method: "DELETE",
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

  async function unassignUnit(unitId: string, incidentId: string) {
    if (!confirm("Are you sure you want to unassign this unit?")) return

    // Remove assignment from incident
    const res = await fetch(`/api/incidents/${incidentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignedUnitId: null,
        assignedUnitName: null,
        status: "Open",
      }),
    })
    if (res.ok) {
      // Set unit back to Available
      await updateUnitStatus(unitId, "Available")
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
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <UnitDialog onCreate={addUnit} />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="units" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="units" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Units ({units.length})
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Assignments ({assignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="units" className="mt-4">
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
                              <SelectTrigger className="h-8 w-[130px]">
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
                            <div className="flex items-center gap-2 justify-end">
                              <Dialog
                                open={assignUnitId === u.id}
                                onOpenChange={(o) => {
                                  setAssignUnitId(o ? u.id : null)
                                  setSelectedIncidentId(null)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent"
                                    disabled={u.status === "Unavailable"}
                                  >
                                    Assign
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Assign Incident to {u.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-3">
                                    <div className="text-sm text-muted-foreground">
                                      Choose an incident to assign to this unit.
                                    </div>
                                    <Select value={selectedIncidentId ?? ""} onValueChange={setSelectedIncidentId}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select incident" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {openIncidents.length === 0 ? (
                                          <div className="px-3 py-2 text-sm text-muted-foreground">
                                            No open incidents
                                          </div>
                                        ) : (
                                          openIncidents
                                            .filter((i) => !i.assignedUnitId) // Only show unassigned incidents
                                            .map((i) => (
                                              <SelectItem key={i.id} value={i.id}>
                                                <div className="flex items-center gap-2">
                                                  <span>
                                                    {i.type} — {i.location}
                                                  </span>
                                                  <Badge
                                                    variant="outline"
                                                    className={`ml-2 ${severityColor(i.severity)}`}
                                                  >
                                                    {i.severity}
                                                  </Badge>
                                                </div>
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeUnit(u.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="mt-4">
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Incident</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                          {loading ? "Loading assignments..." : "No active assignments."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignments.map((assignment) => (
                        <TableRow key={`${assignment.unitId}-${assignment.incidentId}`}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-emerald-700" />
                              {assignment.unitName}
                            </div>
                          </TableCell>
                          <TableCell>{assignment.incidentType}</TableCell>
                          <TableCell>
                            <Badge className={severityColor(assignment.incidentSeverity)} variant="outline">
                              {assignment.incidentSeverity}
                            </Badge>
                          </TableCell>
                          <TableCell>{assignment.incidentLocation}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatTimeAgo(new Date(assignment.assignedAt))}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => unassignUnit(assignment.unitId, assignment.incidentId)}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            >
                              Unassign
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
