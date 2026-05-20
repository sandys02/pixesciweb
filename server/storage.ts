import { type User, type InsertUser, type WaitlistSignup, type InsertWaitlistSignup, users, waitlistSignups } from "@shared/schema";
import { drizzle } from "drizzle-orm/netlify-db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createWaitlistSignup(signup: InsertWaitlistSignup): Promise<WaitlistSignup>;
  getAllWaitlistSignups(): Promise<WaitlistSignup[]>;
}

class MemStorage implements IStorage {
  private users: Map<string, User>;
  private waitlistSignups: Map<string, WaitlistSignup>;

  constructor() {
    this.users = new Map();
    this.waitlistSignups = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistSignup(insertSignup: InsertWaitlistSignup): Promise<WaitlistSignup> {
    const id = randomUUID();
    const signup: WaitlistSignup = {
      id,
      email: insertSignup.email,
      name: insertSignup.name,
      software: insertSignup.software ?? null,
      websiteUrl: insertSignup.websiteUrl ?? null,
      createdAt: new Date(),
    };
    this.waitlistSignups.set(id, signup);
    return signup;
  }

  async getAllWaitlistSignups(): Promise<WaitlistSignup[]> {
    return Array.from(this.waitlistSignups.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

class DatabaseStorage implements IStorage {
  private db;
  private fallback: MemStorage;
  private useFallback: boolean = false;

  constructor() {
    this.fallback = new MemStorage();
    try {
      this.db = drizzle();
    } catch (error) {
      console.warn('Failed to initialize database connection, using in-memory storage:', error);
      this.useFallback = true;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    if (this.useFallback || !this.db) return this.fallback.getUser(id);
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.warn('Database query failed, falling back to memory storage:', error);
      this.useFallback = true;
      return this.fallback.getUser(id);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (this.useFallback || !this.db) return this.fallback.getUserByUsername(username);
    try {
      const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.warn('Database query failed, falling back to memory storage:', error);
      this.useFallback = true;
      return this.fallback.getUserByUsername(username);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (this.useFallback || !this.db) return this.fallback.createUser(insertUser);
    try {
      const result = await this.db.insert(users).values(insertUser).returning();
      return result[0];
    } catch (error) {
      console.warn('Database insert failed, falling back to memory storage:', error);
      this.useFallback = true;
      return this.fallback.createUser(insertUser);
    }
  }

  async createWaitlistSignup(insertSignup: InsertWaitlistSignup): Promise<WaitlistSignup> {
    if (this.useFallback || !this.db) return this.fallback.createWaitlistSignup(insertSignup);
    try {
      const result = await this.db.insert(waitlistSignups).values(insertSignup).returning();
      return result[0];
    } catch (error) {
      console.warn('Database insert failed, falling back to memory storage:', error);
      this.useFallback = true;
      return this.fallback.createWaitlistSignup(insertSignup);
    }
  }

  async getAllWaitlistSignups(): Promise<WaitlistSignup[]> {
    if (this.useFallback || !this.db) return this.fallback.getAllWaitlistSignups();
    try {
      return await this.db.select().from(waitlistSignups).orderBy(desc(waitlistSignups.createdAt));
    } catch (error) {
      console.warn('Database query failed, falling back to memory storage:', error);
      this.useFallback = true;
      return this.fallback.getAllWaitlistSignups();
    }
  }
}

export const storage = new DatabaseStorage();
