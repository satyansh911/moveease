import type { ObjectId } from "mongodb"

export interface IIncident {
  _id?: ObjectId
  id: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  location: string
  status: "Open" | "In Progress" | "Cleared"
  reportedAt: Date
  assignedUnitId?: string
  assignedUnitName?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateIncidentData {
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  location: string
}

export interface UpdateIncidentData {
  status?: "Open" | "In Progress" | "Cleared"
  assignedUnitId?: string
  assignedUnitName?: string
}
