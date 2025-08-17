import database from "@/lib/db"
import type { ICamera, CreateCameraData, UpdateCameraData } from "@/lib/models/camera"
import { generateId } from "@/lib/utils/id-generator"

export class CameraService {
  private static instance: CameraService
  private collectionName = "cameras"

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService()
    }
    return CameraService.instance
  }

  async getAll(): Promise<ICamera[]> {
    const collection = await database.getCollection<ICamera>(this.collectionName)
    return await collection.find({}).sort({ name: 1 }).toArray()
  }

  async create(data: CreateCameraData): Promise<ICamera> {
    const collection = await database.getCollection<ICamera>(this.collectionName)

    const camera: ICamera = {
      id: generateId("c"),
      name: data.name,
      status: "Online",
      img: data.img,
      location: data.location,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await collection.insertOne(camera)
    return camera
  }

  async update(id: string, data: UpdateCameraData): Promise<ICamera | null> {
    const collection = await database.getCollection<ICamera>(this.collectionName)

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" })

    return result
  }
}

export const cameraService = CameraService.getInstance()
