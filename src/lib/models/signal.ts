import type { ObjectId } from "mongodb"

export interface ISignal {
  _id?: ObjectId
  id: string
  name: string
  location: string
  currentState: "Red" | "Yellow" | "Green"
  timing: {
    red: number
    yellow: number
    green: number
  }
  mode: "Auto" | "Manual" | "Maintenance"
  lastUpdated: Date
  createdAt: Date
}

export interface CreateSignalData {
  name: string
  location: string
  timing?: {
    red: number
    yellow: number
    green: number
  }
}

export interface UpdateSignalData {
  currentState?: "Red" | "Yellow" | "Green"
  mode?: "Auto" | "Manual" | "Maintenance"
  timing?: {
    red: number
    yellow: number
    green: number
  }
}
