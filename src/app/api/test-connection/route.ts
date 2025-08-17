import { hasMongoEnv, getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    // Check if environment variable exists
    if (!hasMongoEnv()) {
      return Response.json(
        {
          status: "error",
          message: "MONGODB_URI environment variable is not set",
          hasEnvVar: false,
          envValue: process.env.MONGODB_URI ? "SET" : "NOT SET",
        },
        { status: 400 },
      )
    }

    // Try to connect
    const db = await getDb()

    // Test the connection with a simple operation
    const collections = await db.listCollections().toArray()

    return Response.json({
      status: "success",
      message: "MongoDB connection successful",
      database: db.databaseName,
      collections: collections.map((c) => c.name),
      hasEnvVar: true,
    })
  } catch (error) {
    console.error("MongoDB connection test failed:", error)

    return Response.json(
      {
        status: "error",
        message: "Failed to connect to MongoDB",
        error: error instanceof Error ? error.message : "Unknown error",
        hasEnvVar: hasMongoEnv(),
      },
      { status: 500 },
    )
  }
}
