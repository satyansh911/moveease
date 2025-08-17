import database from "@/lib/db"
import type { ISignal, CreateSignalData, UpdateSignalData } from "@/lib/models/signal"
import { generateId } from "@/lib/utils/id-generator"

export class SignalService {
  private static instance: SignalService
  private collectionName = "signals"

  static getInstance(): SignalService {
    if (!SignalService.instance) {
      SignalService.instance = new SignalService()
    }
    return SignalService.instance
  }

  async getAll(): Promise<ISignal[]> {
    const collection = await database.getCollection<ISignal>(this.collectionName)
    return await collection.find({}).sort({ name: 1 }).toArray()
  }

  async getById(id: string): Promise<ISignal | null> {
    const collection = await database.getCollection<ISignal>(this.collectionName)
    return await collection.findOne({ id })
  }

  async create(data: CreateSignalData): Promise<ISignal> {
    const collection = await database.getCollection<ISignal>(this.collectionName)

    const signal: ISignal = {
      id: generateId("s"),
      name: data.name,
      location: data.location,
      currentState: "Green",
      timing: data.timing || { red: 30, yellow: 5, green: 25 },
      mode: "Auto",
      lastUpdated: new Date(),
      createdAt: new Date(),
    }

    await collection.insertOne(signal)
    return signal
  }

  async update(id: string, data: UpdateSignalData): Promise<ISignal | null> {
    const collection = await database.getCollection<ISignal>(this.collectionName)

    const updateData = {
      ...data,
      lastUpdated: new Date(),
    }

    const result = await collection.findOneAndUpdate({ id }, { $set: updateData }, { returnDocument: "after" })

    return result
  }

  async updateState(id: string, state: "Red" | "Yellow" | "Green"): Promise<ISignal | null> {
    return this.update(id, { currentState: state })
  }
}

export const signalService = SignalService.getInstance()
