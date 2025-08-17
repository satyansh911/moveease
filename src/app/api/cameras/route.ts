import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { cameraService } from "@/lib/services/camera-service"
import { store } from "@/lib/server-data"

export async function GET() {
  try {
    if (!database.isConnected()) {
      return Response.json(store.cameras)
    }

    const cameras = await cameraService.getAll()
    const result = cameras.map((camera) => ({
      id: camera.id,
      name: camera.name,
      status: camera.status,
      img: camera.img,
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
      const newCamera = {
        id: `c${Math.random().toString(36).slice(2, 8)}`,
        name: body.name,
        status: "Online" as const,
        img: body.img,
      }
      store.cameras = [...store.cameras, newCamera as any]
      return Response.json(newCamera, { status: 201 })
    }

    const camera = await cameraService.create({
      name: body.name,
      img: body.img,
      location: body.location,
    })

    const result = {
      id: camera.id,
      name: camera.name,
      status: camera.status,
      img: camera.img,
    }

    return Response.json(result, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
