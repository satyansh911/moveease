import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { incidentService } from "@/lib/services/incident-service"
import { unitService } from "@/lib/services/unit-service"
import { store } from "@/lib/server-data"

export async function GET() {
  try {
    if (!database.isConnected()) {
      // Fallback to in-memory store
      const result = store.incidents.map((i) => {
        const assigned = i.assignedUnitId ? store.units.find((u) => u.id === i.assignedUnitId) : undefined
        return {
          id: i.id,
          type: i.type,
          severity: i.severity,
          location: i.location,
          status: i.status,
          reportedAt: i.reportedAt,
          assignedUnitId: i.assignedUnitId,
          assignedUnitName: assigned?.name ?? i.assignedUnitName,
        }
      })
      return Response.json(result)
    }

    const incidents = await incidentService.getAll()

    // Populate assigned unit names
    const result = await Promise.all(
      incidents.map(async (incident) => {
        let assignedUnitName = incident.assignedUnitName
        if (incident.assignedUnitId && !assignedUnitName) {
          const unit = await unitService.getById(incident.assignedUnitId)
          assignedUnitName = unit?.name
        }

        return {
          id: incident.id,
          type: incident.type,
          severity: incident.severity,
          location: incident.location,
          status: incident.status,
          reportedAt: incident.reportedAt.toISOString(),
          assignedUnitId: incident.assignedUnitId,
          assignedUnitName,
        }
      }),
    )

    return Response.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!database.isConnected()) {
      // Fallback to in-memory store
      const newIncident = {
        id: `i${Math.random().toString(36).slice(2, 8)}`,
        type: body.type,
        severity: body.severity,
        location: body.location,
        status: "Open" as const,
        reportedAt: new Date().toISOString(),
      }
      store.incidents = [newIncident as any, ...store.incidents]
      return Response.json(newIncident, { status: 201 })
    }

    const incident = await incidentService.create({
      type: body.type,
      severity: body.severity,
      location: body.location,
    })

    const result = {
      id: incident.id,
      type: incident.type,
      severity: incident.severity,
      location: incident.location,
      status: incident.status,
      reportedAt: incident.reportedAt.toISOString(),
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
