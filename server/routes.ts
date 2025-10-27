import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSignupSchema } from "@shared/schema";
import { z } from "zod";
import { sendWaitlistConfirmation } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSignupSchema.parse(req.body);
      const signup = await storage.createWaitlistSignup(validatedData);
      
      try {
        await sendWaitlistConfirmation(signup.email, signup.name);
      } catch (emailError) {
        console.error("Failed to send confirmation email, but signup was saved:", emailError);
      }
      
      res.json({ success: true, id: signup.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Invalid form data",
          details: error.errors 
        });
      } else {
        console.error("Error creating waitlist signup:", error);
        res.status(500).json({ 
          success: false, 
          error: "Failed to process signup" 
        });
      }
    }
  });

  app.get("/api/waitlist", async (req, res) => {
    try {
      const signups = await storage.getAllWaitlistSignups();
      res.json({ success: true, signups });
    } catch (error) {
      console.error("Error fetching waitlist signups:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch signups" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
