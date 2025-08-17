import type { ObjectId } from "mongodb"

export interface ITrafficData {
  _id?: ObjectId
  id: string
  location: string
  avgSpeed: number
  vehicleCount: number
  congestionLevel: number
  timestamp: Date
}

export interface CreateTrafficDataInput {
  location: string
  avgSpeed: number
  vehicleCount: number
  congestionLevel: number
}
