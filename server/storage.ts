import { db } from "./db";
import {
  feedbacks,
  type InsertFeedback,
  type Feedback
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getFeedbacks(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  async getFeedbacks(): Promise<Feedback[]> {
    return await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt));
  }

  async createFeedback(feedback: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedbacks).values(feedback).returning();
    return newFeedback;
  }
}

export const storage = new DatabaseStorage();