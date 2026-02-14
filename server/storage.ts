
import { db } from "./db";
import { credentials, type InsertCredential } from "@shared/schema";

export interface IStorage {
  createCredential(credential: InsertCredential): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createCredential(credential: InsertCredential): Promise<void> {
    await db.insert(credentials).values(credential);
  }
}

export const storage = new DatabaseStorage();
