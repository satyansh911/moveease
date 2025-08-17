import { MongoClient, type Db, type Collection } from "mongodb"

let client: MongoClient | undefined
let db: Db | undefined

export function hasMongoEnv() {
  return Boolean(process.env.MONGODB_URI)
}

export async function getDb(): Promise<Db> {
  if (!hasMongoEnv()) {
    throw new Error("MONGODB_URI env var missing. Set it to your MongoDB connection string.")
  }

  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!)
    await client.connect()
    db = client.db("moveease")
  }

  return db!
}

export async function getCollection<T extends import("mongodb").Document = import("mongodb").Document>(name: string): Promise<Collection<T>> {
  const database = await getDb()
  return database.collection<T>(name)
}

// Graceful shutdown
process.on("SIGINT", async () => {
  if (client) {
    await client.close()
  }
  process.exit(0)
})
