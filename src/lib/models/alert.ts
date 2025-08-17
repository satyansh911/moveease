import type { ObjectId } from "mongodb"

export interface IAlert {
  _id?: ObjectId
  id: string
  title: string
  detail: string
  level: "Advisory" | "Warning" | "Critical"
  createdAt: Date
  isActive: boolean
}

export interface CreateAlertData {
  title: string
  detail: string
  level: "Advisory" | "Warning" | "Critical"
}
