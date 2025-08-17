import { readFile } from "node:fs/promises"
import path from "node:path"
import mysql from "mysql2/promise"

async function main() {
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env
  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE || typeof MYSQL_PASSWORD === "undefined") {
    console.error("Missing MYSQL_* env vars.")
    process.exit(1)
  }

  const conn = await mysql.createConnection({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT || 3306),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    multipleStatements: true,
  })

  const files = ["001_init.sql", "002_seed.sql"]
  for (const f of files) {
    const p = path.join(process.cwd(), "scripts", "sql", f)
    const sql = await readFile(p, "utf8")
    console.log(`Running ${f}...`)
    await conn.query(sql)
  }

  await conn.end()
  console.log("Migrations complete.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
