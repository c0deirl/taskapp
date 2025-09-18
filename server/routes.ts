import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Task API endpoints
  // GET /api/tasks - Get all tasks for a user
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      // In a real app, you would get the userId from the authenticated user
      // For now, we'll use a query parameter for testing
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      const tasks = await storage.getTasks(userId);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // GET /api/tasks/:id - Get a specific task
  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(200).json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      return res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // POST /api/tasks - Create a new task
  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      return res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error creating task:", error);
      return res.status(500).json({ message: "Failed to create task" });
    }
  });

  // PATCH /api/tasks/:id - Update a task
  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const validatedData = updateTaskSchema.parse(req.body);
      
      const updatedTask = await storage.updateTask(taskId, validatedData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(200).json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      console.error("Error updating task:", error);
      return res.status(500).json({ message: "Failed to update task" });
    }
  });

  // DELETE /api/tasks/:id - Delete a task
  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const success = await storage.deleteTask(taskId);
      
      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ message: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
