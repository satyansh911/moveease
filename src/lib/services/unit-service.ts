import database from "@/lib/db"
import type { IUnit, CreateUnitData, UpdateUnitData } from "@/lib/models/unit"
import { generateId } from "@/lib/utils/id-generator"

export class UnitService {
  private static instance: UnitService
  private collectionName = "units"

  static getInstance(): UnitService {
    if (!UnitService.instance) {
      UnitService.instance = new UnitService()
    }
    return UnitService.instance
  }

  async getAll(): Promise<IUnit[]> {
    const collection = await database.getCollection<IUnit>(this.collectionName)
    return await collection.find({}).sort({ name: 1 }).toArray()
  }

  async getById(id: string): Promise<IUnit | null> {
    const collection = await database.getCollection<IUnit>(this.collectionName)
    return await collection.findOne({ id })
  }

  async create(data: CreateUnitData): Promise<IUnit> {
    const collection = await database.getCollection<IUnit>(this.collectionName)

    const unit: IUnit = {
      id: generateId("u"),
      name: data.name,
      type: data.type,
      status: "Available",
      location: data.location,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await collection.insertOne(unit)
    return unit
  }

  async update(id: string, data: UpdateUnitData): Promise<IUnit | null> {
    const collection = await database.getCollection<IUnit>(this.collectionName)

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" })

    return result
  }

  async getAvailableUnits(): Promise<IUnit[]> {
    const collection = await database.getCollection<IUnit>(this.collectionName)
    return await collection.find({ status: "Available" }).toArray()
  }
}

export const unitService = UnitService.getInstance()
