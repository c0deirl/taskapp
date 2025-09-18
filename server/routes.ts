import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { z } from "zod";
import { logger } from './db';

// Add type definition for session
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Task API endpoints
  // Middleware to ensure user is authenticated
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      logger.warn('Unauthorized access attempt', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      return res.status(401).json({ message: "Unauthorized" });
    }
    logger.debug('Authenticated request', {
      userId: req.session.userId,
      path: req.path,
      method: req.method
    });
    next();
  };

  // GET /api/tasks - Get all tasks for the authenticated user
  app.get("/api/tasks", requireAuth, async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks(req.session.userId);
      logger.info('Tasks retrieved successfully', {
        userId: req.session.userId,
        taskCount: tasks.length
      });
      return res.status(200).json(tasks);
    } catch (error) {
      logger.error('Failed to fetch tasks', {
        userId: req.session.userId,
        error: error instanceof Error ? error.message : String(error)
      });
      return res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // GET /api/tasks/:id - Get a specific task
  app.get("/api/tasks/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(200).json(task);
    } catch (error) {
      logger.error("Error fetching task:", {
        userId: req.session.userId,
        taskId: req.params.id,
        error: error instanceof Error ? error.message : String(error)
      });
      return res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // POST /api/tasks - Create a new task
  app.post("/api/tasks", requireAuth, async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      logger.debug('Creating new task', {
        userId: req.session.userId,
        taskData: validatedData
      });
      const task = await storage.createTask(validatedData);
      logger.info('Task created successfully', {
        userId: req.session.userId,
        taskId: task.id
      });
      return res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Invalid task data submitted', {
          userId: req.session.userId,
          validationErrors: error.errors
        });
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      logger.error('Failed to create task', {
        userId: req.session.userId,
        error: error instanceof Error ? error.message : String(error)
      });
      return res.status(500).json({ message: "Failed to create task" });
    }
  });

  // PATCH /api/tasks/:id - Update a task
  app.patch("/api/tasks/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      const validatedData = updateTaskSchema.parse(req.body);
      
      logger.debug('Updating task', {
        userId: req.session.userId,
        taskId,
        updateData: validatedData
      });
      
      const updatedTask = await storage.updateTask(taskId, validatedData);
      
      if (!updatedTask) {
        logger.warn('Task not found for update', {
          userId: req.session.userId,
          taskId
        });
        return res.status(404).json({ message: "Task not found" });
      }
      
      logger.info('Task updated successfully', {
        userId: req.session.userId,
        taskId
      });
      return res.status(200).json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.warn('Invalid task update data', {
          userId: req.session.userId,
          taskId: req.params.id,
          validationErrors: error.errors
        });
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      logger.error('Failed to update task', {
        userId: req.session.userId,
        taskId: req.params.id,
        error: error instanceof Error ? error.message : String(error)
      });
      return res.status(500).json({ message: "Failed to update task" });
    }
  });

  // DELETE /api/tasks/:id - Delete a task
  app.delete("/api/tasks/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const taskId = req.params.id;
      logger.debug('Attempting to delete task', {
        userId: req.session.userId,
        taskId
      });
      
      const success = await storage.deleteTask(taskId);
      
      if (!success) {
        logger.warn('Task not found for deletion', {
          userId: req.session.userId,
          taskId
        });
        return res.status(404).json({ message: "Task not found" });
      }
      
      logger.info('Task deleted successfully', {
        userId: req.session.userId,
        taskId
      });
      return res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete task', {
        userId: req.session.userId,
        taskId: req.params.id,
        error: error instanceof Error ? error.message : String(error)
      });
      return res.status(500).json({ message: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
