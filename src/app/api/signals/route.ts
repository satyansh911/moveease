import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { signalService } from "@/lib/services/signal-service"

// In-memory fallback data
const fallbackSignals = [
  {
    id: "s1",
    name: "Main & 5th Street",
    location: "Main St & 5th Ave",
    currentState: "Green" as const,
    mode: "Auto" as const,
    timing: { red: 30, yellow: 5, green: 25 },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "s2",
    name: "Broadway & Oak",
    location: "Broadway & Oak St",
    currentState: "Red" as const,
    mode: "Manual" as const,
    timing: { red: 35, yellow: 5, green: 30 },
    lastUpdated: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    if (!database.isConnected()) {
      return Response.json(fallbackSignals)
    }

    const signals = await signalService.getAll()
    const result = signals.map((signal) => ({
      id: signal.id,
      name: signal.name,
      location: signal.location,
      currentState: signal.currentState,
      mode: signal.mode,
      timing: signal.timing,
      lastUpdated: signal.lastUpdated.toISOString(),
    }))

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
      const newSignal = {
        id: `s${Math.random().toString(36).slice(2, 8)}`,
        name: body.name,
        location: body.location,
        currentState: "Green" as const,
        mode: "Auto" as const,
        timing: body.timing || { red: 30, yellow: 5, green: 25 },
        lastUpdated: new Date().toISOString(),
      }
      fallbackSignals.push(newSignal)
      return Response.json(newSignal, { status: 201 })
    }

    const signal = await signalService.create({
      name: body.name,
      location: body.location,
      timing: body.timing,
    })

    const result = {
      id: signal.id,
      name: signal.name,
      location: signal.location,
      currentState: signal.currentState,
      mode: signal.mode,
      timing: signal.timing,
      lastUpdated: signal.lastUpdated.toISOString(),
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
