import type { ObjectId } from "mongodb"

export interface IUnit {
  _id?: ObjectId
  id: string
  name: string
  type: "Patrol Car" | "Motorbike" | "Tow Truck" | "Supervisor"
  status: "Available" | "En Route" | "On Scene" | "Unavailable"
  location: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUnitData {
  name: string
  type: "Patrol Car" | "Motorbike" | "Tow Truck" | "Supervisor"
  location: string
}

export interface UpdateUnitData {
  status?: "Available" | "En Route" | "On Scene" | "Unavailable"
  location?: string
}
