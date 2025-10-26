import { type User, type InsertUser, type WaitlistSignup, type InsertWaitlistSignup, users, waitlistSignups } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq, desc } from "drizzle-orm";
import { Pool } from "@neondatabase/serverless";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createWaitlistSignup(signup: InsertWaitlistSignup): Promise<WaitlistSignup>;
  getAllWaitlistSignups(): Promise<WaitlistSignup[]>;
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createWaitlistSignup(insertSignup: InsertWaitlistSignup): Promise<WaitlistSignup> {
    const result = await this.db.insert(waitlistSignups).values(insertSignup).returning();
    return result[0];
  }

  async getAllWaitlistSignups(): Promise<WaitlistSignup[]> {
    return await this.db.select().from(waitlistSignups).orderBy(desc(waitlistSignups.createdAt));
  }
}

export const storage = new DatabaseStorage();
