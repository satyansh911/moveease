"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, RefreshCw } from "lucide-react"
import { IncidentDialog, type IncidentForm } from "./incident-dialog"
import { formatTimeAgo, severityColor } from "@/lib/traffic"

export type Incident = {
  id: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  location: string
  status: "Open" | "In Progress" | "Cleared"
  reportedAt: string
  assignedUnitId?: string
  assignedUnitName?: string
}

export function IncidentTable({
  title = "Incidents",
}: {
  title?: string
}) {
  const [loading, setLoading] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>([])

  async function fetchIncidents() {
    setLoading(true)
    try {
      const res = await fetch("/api/incidents", { cache: "no-store" })
      const data = (await res.json()) as Incident[]
      setIncidents(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  async function addIncident(payload: IncidentForm) {
    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      fetchIncidents()
    }
  }

  async function updateIncidentStatus(id: string, status: "Open" | "In Progress" | "Cleared") {
    await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    fetchIncidents()
  }

  return (
    <section id="incidents" aria-label="Incident management">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchIncidents}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <IncidentDialog onCreate={addIncident} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                      {loading ? "Loading incidents..." : "No incidents yet. Add one to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.type}</TableCell>
                      <TableCell>
                        <Badge
                          className={severityColor(i.severity)}
                          variant="outline"
                          aria-label={`Severity ${i.severity}`}
                        >
                          {i.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{i.location}</TableCell>
                      <TableCell>
                        {i.assignedUnitName ? (
                          <span className="text-sm">{i.assignedUnitName}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            i.status === "Cleared" ? "secondary" : i.status === "In Progress" ? "default" : "outline"
                          }
                        >
                          {i.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatTimeAgo(new Date(i.reportedAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1">
                              Actions
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {i.status !== "In Progress" && (
                              <DropdownMenuItem onClick={() => updateIncidentStatus(i.id, "In Progress")}>
                                Mark In Progress
                              </DropdownMenuItem>
                            )}
                            {i.status !== "Cleared" && (
                              <DropdownMenuItem onClick={() => updateIncidentStatus(i.id, "Cleared")}>
                                Mark Resolved
                              </DropdownMenuItem>
                            )}
                            {i.status !== "Open" && (
                              <DropdownMenuItem onClick={() => updateIncidentStatus(i.id, "Open")}>
                                Reopen
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
