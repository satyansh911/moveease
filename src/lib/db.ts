import { MongoClient, type Db, type Collection, type Document } from "mongodb"

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

class Database {
  private static instance: Database
  private client: MongoClient | null = null
  private db: Db | null = null

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  async connect(): Promise<void> {
    if (this.client && this.db) {
      return
    }

    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    try {
      // Use global variable to prevent multiple connections in development
      if (!global._mongoClientPromise) {
        this.client = new MongoClient(uri)
        global._mongoClientPromise = this.client.connect()
      }

      this.client = await global._mongoClientPromise
      this.db = this.client.db("moveease")

      console.log("Connected to MongoDB")
    } catch (error) {
      console.error("MongoDB connection error:", error)
      throw error
    }
  }

  async getDb(): Promise<Db> {
    if (!this.db) {
      await this.connect()
    }
    return this.db!
  }

  async getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
    const db = await this.getDb()
    return db.collection<T>(name)
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      global._mongoClientPromise = undefined
    }
  }

  isConnected(): boolean {
    return Boolean(process.env.MONGODB_URI)
  }
}

export const database = Database.getInstance()
export default database
