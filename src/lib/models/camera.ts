import type { ObjectId } from "mongodb"

export interface ICamera {
  _id?: ObjectId
  id: string
  name: string
  status: "Online" | "Offline"
  img: string
  location?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCameraData {
  name: string
  img: string
  location?: string
}

export interface UpdateCameraData {
  status?: "Online" | "Offline"
  location?: string
}
