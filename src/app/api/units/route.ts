import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { unitService } from "@/lib/services/unit-service"
import { store } from "@/lib/server-data"

export async function GET() {
  try {
    if (!database.isConnected()) {
      return Response.json(store.units)
    }

    const units = await unitService.getAll()
    const result = units.map((unit) => ({
      id: unit.id,
      name: unit.name,
      type: unit.type,
      status: unit.status,
      location: unit.location,
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
      const newUnit = {
        id: `u${Math.random().toString(36).slice(2, 8)}`,
        name: body.name,
        type: body.type,
        status: "Available" as const,
        location: body.location,
      }
      store.units = [...store.units, newUnit as any]
      return Response.json(newUnit, { status: 201 })
    }

    const unit = await unitService.create({
      name: body.name,
      type: body.type,
      location: body.location,
    })

    const result = {
      id: unit.id,
      name: unit.name,
      type: unit.type,
      status: unit.status,
      location: unit.location,
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, location } = body

    if (!database.isConnected()) {
      const idx = store.units.findIndex((u) => u.id === id)
      if (idx === -1) {
        return Response.json({ error: "Unit not found" }, { status: 404 })
      }

      store.units[idx] = {
        ...store.units[idx],
        status: status ?? store.units[idx].status,
        location: location ?? store.units[idx].location,
      }
      return Response.json(store.units[idx])
    }

    const updatedUnit = await unitService.update(id, { status, location })

    if (!updatedUnit) {
      return Response.json({ error: "Unit not found" }, { status: 404 })
    }

    const result = {
      id: updatedUnit.id,
      name: updatedUnit.name,
      type: updatedUnit.type,
      status: updatedUnit.status,
      location: updatedUnit.location,
    }

    return Response.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
