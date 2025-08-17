import type { NextRequest } from "next/server"
import database from "@/lib/db"
import { cameraService } from "@/lib/services/camera-service"
import { store } from "@/lib/server-data"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    if (!database.isConnected()) {
      const idx = store.cameras.findIndex((c) => c.id === id)
      if (idx === -1) {
        return Response.json({ error: "Camera not found" }, { status: 404 })
      }

      store.cameras[idx] = {
        ...store.cameras[idx],
        status: body.status ?? store.cameras[idx].status,
      }
      return Response.json(store.cameras[idx])
    }

    const updatedCamera = await cameraService.update(id, {
      status: body.status,
    })

    if (!updatedCamera) {
      return Response.json({ error: "Camera not found" }, { status: 404 })
    }

    const result = {
      id: updatedCamera.id,
      name: updatedCamera.name,
      status: updatedCamera.status,
      img: updatedCamera.img,
    }

    return Response.json(result)
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!database.isConnected()) {
      const idx = store.cameras.findIndex((c) => c.id === id)
      if (idx === -1) {
        return Response.json({ error: "Camera not found" }, { status: 404 })
      }
      store.cameras.splice(idx, 1)
      return Response.json({ success: true })
    }

    // For MongoDB, we'll implement a soft delete by updating status
    const updatedCamera = await cameraService.update(id, {
      status: "Offline",
    })

    if (!updatedCamera) {
      return Response.json({ error: "Camera not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
