import database from "@/lib/db"

export async function GET() {
  try {
    if (!database.isConnected()) {
      return Response.json({
        status: "fallback",
        message: "Using in-memory store (MONGODB_URI not set)",
        timestamp: new Date().toISOString(),
      })
    }

    const db = await database.getDb()
    const adminDb = db.admin()
    const serverStatus = await adminDb.serverStatus()

    return Response.json({
      status: "connected",
      message: "MongoDB connection healthy",
      version: serverStatus.version,
      uptime: serverStatus.uptime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "MongoDB connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
