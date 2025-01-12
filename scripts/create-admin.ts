import { db } from "@db";
import { users } from "@db/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdmin() {
  try {
    const hashedPassword = await hashPassword('tart');
    const [user] = await db.insert(users).values({
      username: 'rdc',
      password: hashedPassword,
    }).returning();
    console.log('Admin user created successfully:', user.username);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
  process.exit(0);
}

createAdmin();
