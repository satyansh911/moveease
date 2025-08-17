import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { signalService } from "@/lib/services/signal-service"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    if (!database.isConnected()) {
      return Response.json({ error: "Database not connected" }, { status: 500 })
    }

    const updatedSignal = await signalService.update(id, {
      currentState: body.currentState,
      mode: body.mode,
      timing: body.timing,
    })

    if (!updatedSignal) {
      return Response.json({ error: "Signal not found" }, { status: 404 })
    }

    const result = {
      id: updatedSignal.id,
      name: updatedSignal.name,
      location: updatedSignal.location,
      currentState: updatedSignal.currentState,
      mode: updatedSignal.mode,
      timing: updatedSignal.timing,
      lastUpdated: updatedSignal.lastUpdated.toISOString(),
    }

    return Response.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
