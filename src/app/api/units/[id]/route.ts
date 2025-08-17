import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { store } from "@/lib/server-data"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!database.isConnected()) {
      const idx = store.units.findIndex((u) => u.id === id)
      if (idx === -1) {
        return Response.json({ error: "Unit not found" }, { status: 404 })
      }
      store.units.splice(idx, 1)
      return Response.json({ success: true })
    }

    // For MongoDB, we could implement actual deletion
    const db = await database.getDb()
    const result = await db.collection("units").deleteOne({ id })

    if (result.deletedCount === 0) {
      return Response.json({ error: "Unit not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
