import database from "@/lib/db"
import type { IAlert, CreateAlertData } from "@/lib/models/alert"
import { generateId } from "@/lib/utils/id-generator"

export class AlertService {
  private static instance: AlertService
  private collectionName = "alerts"

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService()
    }
    return AlertService.instance
  }

  async getActive(): Promise<IAlert[]> {
    const collection = await database.getCollection<IAlert>(this.collectionName)
    return await collection.find({ isActive: true }).sort({ createdAt: -1 }).limit(50).toArray()
  }

  async create(data: CreateAlertData): Promise<IAlert> {
    const collection = await database.getCollection<IAlert>(this.collectionName)

    const alert: IAlert = {
      id: generateId("a"),
      title: data.title,
      detail: data.detail,
      level: data.level,
      createdAt: new Date(),
      isActive: true,
    }

    await collection.insertOne(alert)
    return alert
  }

  async deactivate(id: string): Promise<boolean> {
    const collection = await database.getCollection<IAlert>(this.collectionName)
    const result = await collection.updateOne({ id }, { $set: { isActive: false } })
    return result.modifiedCount > 0
  }
}

export const alertService = AlertService.getInstance()
