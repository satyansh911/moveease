import database from "@/lib/db"
import { trafficDataService } from "@/lib/services/traffic-data-service"

// Fallback data
const fallbackTrafficData = [
  { location: "Main St", avgSpeed: 35, congestionLevel: 45 },
  { location: "Broadway", avgSpeed: 42, congestionLevel: 30 },
  { location: "5th Ave", avgSpeed: 28, congestionLevel: 65 },
]

export async function GET() {
  try {
    if (!database.isConnected()) {
      return Response.json(fallbackTrafficData)
    }

    const trafficData = await trafficDataService.getLatestData()
    const result = trafficData.map((data) => ({
      location: data.location,
      avgSpeed: data.avgSpeed,
      congestionLevel: data.congestionLevel,
    }))

    return Response.json(result.length > 0 ? result : fallbackTrafficData)
  } catch (error) {
    console.error("API Error:", error)
    return Response.json(fallbackTrafficData)
  }
}
