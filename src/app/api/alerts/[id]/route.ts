import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { alertService } from "@/lib/services/alert-service"
import { store } from "@/lib/server-data"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!database.isConnected()) {
      // Fallback to in-memory store
      const idx = store.alerts.findIndex((x) => x.id === id)
      if (idx === -1) {
        return Response.json({ error: "Alert not found" }, { status: 404 })
      }
      store.alerts.splice(idx, 1)
      return Response.json({ success: true })
    }

    const success = await alertService.deactivate(id)
    if (!success) {
      return Response.json({ error: "Alert not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
