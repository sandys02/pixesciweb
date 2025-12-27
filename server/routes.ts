import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSignupSchema } from "@shared/schema";
import { z } from "zod";
import { sendWaitlistConfirmation } from "./email";
import { submitToApollo } from "./apollo";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/admin/verify", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword) {
        console.error("ADMIN_PASSWORD environment variable not set");
        res.status(500).json({ 
          success: false, 
          error: "Server configuration error" 
        });
        return;
      }

      if (password === adminPassword) {
        req.session.regenerate((err) => {
          if (err) {
            console.error("Error regenerating session:", err);
            res.status(500).json({ success: false, error: "Session error" });
            return;
          }
          req.session.isAdmin = true;
          req.session.save((saveErr) => {
            if (saveErr) {
              console.error("Error saving session:", saveErr);
              res.status(500).json({ success: false, error: "Session save error" });
              return;
            }
            res.json({ success: true });
          });
        });
      } else {
        res.status(401).json({ 
          success: false, 
          error: "Invalid password" 
        });
      }
    } catch (error) {
      console.error("Error verifying admin password:", error);
      res.status(500).json({ 
        success: false, 
        error: "Verification failed" 
      });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).json({ success: false, error: "Logout failed" });
      } else {
        res.json({ success: true });
      }
    });
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSignupSchema.parse(req.body);
      const signup = await storage.createWaitlistSignup(validatedData);
      
      // Submit to Apollo in background (don't block response)
      submitToApollo({
        email: signup.email,
        name: signup.name,
        software: signup.software,
        websiteUrl: signup.websiteUrl,
      }).catch(err => console.error('[Apollo] Background submission failed:', err));
      
      // Send confirmation email in background
      sendWaitlistConfirmation(signup.email, signup.name)
        .catch(emailError => console.error("Failed to send confirmation email:", emailError));
      
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
