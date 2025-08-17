import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { incidentService } from "@/lib/services/incident-service"
import { unitService } from "@/lib/services/unit-service"
import { store } from "@/lib/server-data"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    if (!database.isConnected()) {
      // Fallback to in-memory store
      const idx = store.incidents.findIndex((x) => x.id === id)
      if (idx === -1) {
        return Response.json({ error: "Incident not found" }, { status: 404 })
      }

      store.incidents[idx] = {
        ...store.incidents[idx],
        status: body.status ?? store.incidents[idx].status,
        assignedUnitId: body.assignedUnitId ?? store.incidents[idx].assignedUnitId,
        assignedUnitName: body.assignedUnitName ?? store.incidents[idx].assignedUnitName,
      }
      return Response.json(store.incidents[idx])
    }

    // Get unit name if assigning and not provided
    let assignedUnitName = body.assignedUnitName
    if (body.assignedUnitId && !assignedUnitName) {
      const unit = await unitService.getById(body.assignedUnitId)
      assignedUnitName = unit?.name
    }

    const updatedIncident = await incidentService.update(id, {
      status: body.status,
      assignedUnitId: body.assignedUnitId,
      assignedUnitName,
    })

    if (!updatedIncident) {
      return Response.json({ error: "Incident not found" }, { status: 404 })
    }

    const result = {
      id: updatedIncident.id,
      type: updatedIncident.type,
      severity: updatedIncident.severity,
      location: updatedIncident.location,
      status: updatedIncident.status,
      reportedAt: updatedIncident.reportedAt.toISOString(),
      assignedUnitId: updatedIncident.assignedUnitId,
      assignedUnitName: updatedIncident.assignedUnitName,
    }

    return Response.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
