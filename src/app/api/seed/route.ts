import database from "@/lib/db"
import { incidentService } from "@/lib/services/incident-service"
import { unitService } from "@/lib/services/unit-service"
import { alertService } from "@/lib/services/alert-service"
import { cameraService } from "@/lib/services/camera-service"
import { signalService } from "@/lib/services/signal-service"
import { trafficDataService } from "@/lib/services/traffic-data-service"

const seedData = {
  units: [
    { name: "Unit 07 — Patrol Car", type: "Patrol Car" as const, location: "5th & Pine" },
    { name: "Unit 12 — Motorbike", type: "Motorbike" as const, location: "Main & 2nd" },
    { name: "Unit 21 — Patrol Car", type: "Patrol Car" as const, location: "Broadway & Oak" },
    { name: "Tow 03 — Tow Truck", type: "Tow Truck" as const, location: "Depot" },
    { name: "Supervisor 1", type: "Supervisor" as const, location: "HQ" },
  ],
  incidents: [
    { type: "Accident", severity: "High" as const, location: "I-405 S @ Exit 12" },
    { type: "Breakdown", severity: "Medium" as const, location: "Main & 2nd" },
    { type: "Roadwork", severity: "Low" as const, location: "3rd Ave" },
  ],
  alerts: [
    {
      title: "Multi-vehicle collision",
      detail: "I-405 S at Exit 12: left two lanes blocked.",
      level: "Critical" as const,
    },
    {
      title: "Roadwork started",
      detail: "3rd Ave maintenance — expect delays.",
      level: "Warning" as const,
    },
    {
      title: "Heavy rain",
      detail: "Reduced visibility reported in downtown.",
      level: "Advisory" as const,
    },
  ],
  cameras: [
    { name: "Cam 12 — 5th & Pine", img: "/traffic-camera-intersection.png" },
    { name: "Cam 27 — I-90 EB", img: "/highway-traffic-camera.png" },
    { name: "Cam 03 — Downtown", img: "/offline-city-camera.png" },
    { name: "Cam 45 — Stadium", img: "/stadium-traffic-camera.png" },
  ],
  signals: [
    { name: "Main & 5th Street", location: "Main St & 5th Ave", timing: { red: 30, yellow: 5, green: 25 } },
    { name: "Broadway & Oak", location: "Broadway & Oak St", timing: { red: 35, yellow: 5, green: 30 } },
    { name: "I-90 On-Ramp", location: "I-90 Eastbound On-Ramp", timing: { red: 25, yellow: 4, green: 20 } },
    { name: "Stadium Blvd", location: "Stadium Blvd & University Way", timing: { red: 40, yellow: 6, green: 35 } },
  ],
  trafficData: [
    { location: "Main St", avgSpeed: 35, vehicleCount: 120, congestionLevel: 45 },
    { location: "Broadway", avgSpeed: 42, vehicleCount: 95, congestionLevel: 30 },
    { location: "5th Ave", avgSpeed: 28, vehicleCount: 150, congestionLevel: 65 },
    { location: "I-90 EB", avgSpeed: 55, vehicleCount: 200, congestionLevel: 25 },
    { location: "Stadium Blvd", avgSpeed: 32, vehicleCount: 110, congestionLevel: 55 },
  ],
}

export async function POST() {
  try {
    if (!database.isConnected()) {
      return Response.json({ error: "MongoDB not connected" }, { status: 400 })
    }

    // Clear existing data
    const db = await database.getDb()
    await Promise.all([
      db.collection("units").deleteMany({}),
      db.collection("incidents").deleteMany({}),
      db.collection("alerts").deleteMany({}),
      db.collection("cameras").deleteMany({}),
      db.collection("signals").deleteMany({}),
      db.collection("trafficData").deleteMany({}),
    ])

    // Seed units
    const units = []
    for (const unitData of seedData.units) {
      const unit = await unitService.create(unitData)
      units.push(unit)
    }

    // Seed incidents
    const incidents = []
    for (const incidentData of seedData.incidents) {
      const incident = await incidentService.create(incidentData)
      incidents.push(incident)
    }

    // Assign one incident to a unit
    if (incidents.length > 1 && units.length > 1) {
      await incidentService.update(incidents[1].id, {
        status: "In Progress",
        assignedUnitId: units[1].id,
        assignedUnitName: units[1].name,
      })
    }

    // Seed alerts
    for (const alertData of seedData.alerts) {
      await alertService.create(alertData)
    }

    // Seed cameras
    for (const cameraData of seedData.cameras) {
      await cameraService.create(cameraData)
    }

    // Seed signals
    for (const signalData of seedData.signals) {
      await signalService.create(signalData)
    }

    // Seed traffic data
    for (const trafficData of seedData.trafficData) {
      await trafficDataService.create(trafficData)
    }

    return Response.json({
      message: "Database seeded successfully",
      counts: {
        units: seedData.units.length,
        incidents: seedData.incidents.length,
        alerts: seedData.alerts.length,
        cameras: seedData.cameras.length,
        signals: seedData.signals.length,
        trafficData: seedData.trafficData.length,
      },
    })
  } catch (error) {
    console.error("Seed Error:", error)
    return Response.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
