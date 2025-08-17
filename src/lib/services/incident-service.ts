import database from "@/lib/db"
import type { IIncident, CreateIncidentData, UpdateIncidentData } from "@/lib/models/incident"
import { generateId } from "@/lib/utils/id-generator"

export class IncidentService {
  private static instance: IncidentService
  private collectionName = "incidents"

  static getInstance(): IncidentService {
    if (!IncidentService.instance) {
      IncidentService.instance = new IncidentService()
    }
    return IncidentService.instance
  }

  async getAll(): Promise<IIncident[]> {
    const collection = await database.getCollection<IIncident>(this.collectionName)
    return await collection.find({}).sort({ reportedAt: -1 }).limit(200).toArray()
  }

  async getById(id: string): Promise<IIncident | null> {
    const collection = await database.getCollection<IIncident>(this.collectionName)
    return await collection.findOne({ id })
  }

  async create(data: CreateIncidentData): Promise<IIncident> {
    const collection = await database.getCollection<IIncident>(this.collectionName)

    const incident: IIncident = {
      id: generateId("i"),
      type: data.type,
      severity: data.severity,
      location: data.location,
      status: "Open",
      reportedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await collection.insertOne(incident)
    return incident
  }

  async update(id: string, data: UpdateIncidentData): Promise<IIncident | null> {
    const collection = await database.getCollection<IIncident>(this.collectionName)

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" })

    return result
  }

  async delete(id: string): Promise<boolean> {
    const collection = await database.getCollection<IIncident>(this.collectionName)
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  }

  async getOpenIncidents(): Promise<IIncident[]> {
    const collection = await database.getCollection<IIncident>(this.collectionName)
    return await collection
      .find({
        status: { $in: ["Open", "In Progress"] },
      })
      .sort({ reportedAt: -1 })
      .toArray()
  }
}

export const incidentService = IncidentService.getInstance()
