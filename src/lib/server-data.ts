export type Severity = "Low" | "Medium" | "High" | "Critical"
export type IncidentStatus = "Open" | "In Progress" | "Cleared"
export type UnitStatus = "Available" | "En Route" | "On Scene" | "Unavailable"

export type Incident = {
  _id?: string
  id: string
  type: string
  severity: Severity
  location: string
  status: IncidentStatus
  reportedAt: string
  assignedUnitId?: string
  assignedUnitName?: string
}

export type Unit = {
  _id?: string
  id: string
  name: string
  type: "Patrol Car" | "Motorbike" | "Tow Truck" | "Supervisor"
  status: UnitStatus
  location: string
}

export type Alert = {
  _id?: string
  id: string
  title: string
  detail: string
  level: "Advisory" | "Warning" | "Critical"
  time: string
}

export type Camera = {
  _id?: string
  id: string
  name: string
  status: "Online" | "Offline"
  img: string
}

// In-memory fallback for v0 preview
export const store: { incidents: Incident[]; units: Unit[]; alerts: Alert[]; cameras: Camera[] } = {
  incidents: [
    {
      id: "i1",
      type: "Accident",
      severity: "High",
      location: "I-405 S @ Exit 12",
      status: "Open",
      reportedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "i2",
      type: "Breakdown",
      severity: "Medium",
      location: "Main & 2nd",
      status: "In Progress",
      reportedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      assignedUnitId: "u2",
      assignedUnitName: "Unit 12 — Motorbike",
    },
    {
      id: "i3",
      type: "Roadwork",
      severity: "Low",
      location: "3rd Ave",
      status: "Open",
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],
  units: [
    {
      id: "u1",
      name: "Unit 07 — Patrol Car",
      type: "Patrol Car",
      status: "Available",
      location: "5th & Pine",
    },
    {
      id: "u2",
      name: "Unit 12 — Motorbike",
      type: "Motorbike",
      status: "On Scene",
      location: "Main & 2nd",
    },
    {
      id: "u3",
      name: "Unit 21 — Patrol Car",
      type: "Patrol Car",
      status: "Available",
      location: "Broadway & Oak",
    },
    {
      id: "u4",
      name: "Tow 03 — Tow Truck",
      type: "Tow Truck",
      status: "Unavailable",
      location: "Depot",
    },
    {
      id: "u5",
      name: "Supervisor 1",
      type: "Supervisor",
      status: "Available",
      location: "HQ",
    },
  ],
  alerts: [
    {
      id: "a1",
      title: "Multi-vehicle collision",
      detail: "I-405 S at Exit 12: left two lanes blocked.",
      level: "Critical",
      time: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: "a2",
      title: "Roadwork started",
      detail: "3rd Ave maintenance — expect delays.",
      level: "Warning",
      time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "a3",
      title: "Heavy rain",
      detail: "Reduced visibility reported in downtown.",
      level: "Advisory",
      time: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    },
  ],
  cameras: [
    {
      id: "c1",
      name: "Cam 12 — 5th & Pine",
      status: "Online",
      img: "/traffic-camera-intersection.png",
    },
    {
      id: "c2",
      name: "Cam 27 — I-90 EB",
      status: "Online",
      img: "/highway-traffic-camera.png",
    },
    {
      id: "c3",
      name: "Cam 03 — Downtown",
      status: "Offline",
      img: "/offline-city-camera.png",
    },
    {
      id: "c4",
      name: "Cam 45 — Stadium",
      status: "Online",
      img: "/stadium-traffic-camera.png",
    },
  ],
}
