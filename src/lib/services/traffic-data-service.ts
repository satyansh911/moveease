import database from "@/lib/db"
import type { ITrafficData, CreateTrafficDataInput } from "@/lib/models/traffic-data"
import { generateId } from "@/lib/utils/id-generator"

export class TrafficDataService {
  private static instance: TrafficDataService
  private collectionName = "trafficData"

  static getInstance(): TrafficDataService {
    if (!TrafficDataService.instance) {
      TrafficDataService.instance = new TrafficDataService()
    }
    return TrafficDataService.instance
  }

  async create(data: CreateTrafficDataInput): Promise<ITrafficData> {
    const collection = await database.getCollection<ITrafficData>(this.collectionName)

    const trafficData: ITrafficData = {
      id: generateId("td"),
      location: data.location,
      avgSpeed: data.avgSpeed,
      vehicleCount: data.vehicleCount,
      congestionLevel: data.congestionLevel,
      timestamp: new Date(),
    }

    await collection.insertOne(trafficData)
    return trafficData
  }

  async getLatestData(): Promise<ITrafficData[]> {
    const collection = await database.getCollection<ITrafficData>(this.collectionName)

    // Get the latest data point for each location
    const pipeline = [
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$location",
          latestData: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latestData" },
      },
    ]

    return (await collection.aggregate(pipeline).toArray()) as ITrafficData[]
  }

  async getAverageSpeed(): Promise<number> {
    const collection = await database.getCollection<ITrafficData>(this.collectionName)

    const result = await collection
      .aggregate([
        {
          $match: {
            timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
          },
        },
        {
          $group: {
            _id: null,
            avgSpeed: { $avg: "$avgSpeed" },
          },
        },
      ])
      .toArray()

    return result[0]?.avgSpeed || 0
  }

  async getCongestionLevel(): Promise<number> {
    const collection = await database.getCollection<ITrafficData>(this.collectionName)

    const result = await collection
      .aggregate([
        {
          $match: {
            timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
          },
        },
        {
          $group: {
            _id: null,
            avgCongestion: { $avg: "$congestionLevel" },
          },
        },
      ])
      .toArray()

    return result[0]?.avgCongestion || 0
  }
}

export const trafficDataService = TrafficDataService.getInstance()
