import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { alertService } from "@/lib/services/alert-service"
import { store } from "@/lib/server-data"

export async function GET() {
  try {
    if (!database.isConnected()) {
      return Response.json(store.alerts)
    }

    const alerts = await alertService.getActive()
    const result = alerts.map((alert) => ({
      id: alert.id,
      title: alert.title,
      detail: alert.detail,
      level: alert.level,
      time: alert.createdAt.toISOString(),
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
      // Fallback to in-memory store
      const newAlert = {
        id: `a${Math.random().toString(36).slice(2, 8)}`,
        title: body.title,
        detail: body.detail,
        level: body.level,
        time: new Date().toISOString(),
      }
      store.alerts = [newAlert as any, ...store.alerts]
      return Response.json(newAlert, { status: 201 })
    }

    const alert = await alertService.create({
      title: body.title,
      detail: body.detail,
      level: body.level,
    })

    const result = {
      id: alert.id,
      title: alert.title,
      detail: alert.detail,
      level: alert.level,
      time: alert.createdAt.toISOString(),
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
