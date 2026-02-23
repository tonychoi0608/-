import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.feedbacks.list.path, async (req, res) => {
    try {
      const allFeedbacks = await storage.getFeedbacks();
      res.json(allFeedbacks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });

  app.post(api.feedbacks.create.path, async (req, res) => {
    try {
      const input = api.feedbacks.create.input.parse(req.body);
      const feedback = await storage.createFeedback(input);
      res.status(201).json(feedback);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  });

  return httpServer;
}