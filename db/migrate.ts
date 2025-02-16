
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/neon-serverless/migrator";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Running migrations...");
  
  try {
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Migrations completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migrations:", error);
    process.exit(1);
  }
}

main();
