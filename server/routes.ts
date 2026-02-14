
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.credentials.create.path, async (req, res) => {
    try {
      const input = api.credentials.create.input.parse(req.body);
      // In a real app we wouldn't store these, but for this demo request we capture them
      // as per the "demo phishing" simulation requirement.
      await storage.createCredential(input);
      
      // Simulate a small network delay for realism
      setTimeout(() => {
        res.json({ success: true });
      }, 1000);
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
