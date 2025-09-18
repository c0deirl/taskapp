import { type User, type InsertUser, type Task, type InsertTask, type UpdateTask, users, tasks } from "@shared/schema";
import { db, logger } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      logger.debug('Fetching user by ID', { userId: id });
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!result[0]) {
        logger.debug('User not found', { userId: id });
      }
      return result[0];
    } catch (error) {
      logger.error('Failed to fetch user', {
        userId: id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      logger.debug('Fetching user by username', { username });
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!result[0]) {
        logger.debug('User not found', { username });
      }
      return result[0];
    } catch (error) {
      logger.error('Failed to fetch user by username', {
        username,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      logger.debug('Creating new user', { username: insertUser.username });
      const result = await db.insert(users).values(insertUser).returning();
      logger.info('User created successfully', { userId: result[0].id });
      return result[0];
    } catch (error) {
      logger.error('Failed to create user', {
        username: insertUser.username,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    try {
      logger.debug('Fetching tasks for user', { userId });
      const tasks = await db.select().from(tasks).where(eq(tasks.userId, userId));
      logger.debug('Tasks retrieved successfully', { userId, taskCount: tasks.length });
      return tasks;
    } catch (error) {
      logger.error('Failed to fetch tasks', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async getTask(id: string): Promise<Task | undefined> {
    try {
      logger.debug('Fetching task by ID', { taskId: id });
      const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
      if (!result[0]) {
        logger.debug('Task not found', { taskId: id });
      }
      return result[0];
    } catch (error) {
      logger.error('Failed to fetch task', {
        taskId: id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async createTask(task: InsertTask): Promise<Task> {
    try {
      logger.debug('Creating new task', { userId: task.userId });
      const result = await db.insert(tasks).values(task).returning();
      logger.info('Task created successfully', { taskId: result[0].id, userId: task.userId });
      return result[0];
    } catch (error) {
      logger.error('Failed to create task', {
        userId: task.userId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async updateTask(id: string, task: UpdateTask): Promise<Task | undefined> {
    try {
      logger.debug('Updating task', { taskId: id, updateData: task });
      const result = await db.update(tasks)
        .set({ ...task, updatedAt: new Date() })
        .where(eq(tasks.id, id))
        .returning();
      
      if (!result[0]) {
        logger.debug('Task not found for update', { taskId: id });
      } else {
        logger.info('Task updated successfully', { taskId: id });
      }
      
      return result[0];
    } catch (error) {
      logger.error('Failed to update task', {
        taskId: id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      logger.debug('Deleting task', { taskId: id });
      const result = await db.delete(tasks).where(eq(tasks.id, id)).returning();
      const success = result.length > 0;
      
      if (success) {
        logger.info('Task deleted successfully', { taskId: id });
      } else {
        logger.debug('Task not found for deletion', { taskId: id });
      }
      
      return success;
    } catch (error) {
      logger.error('Failed to delete task', {
        taskId: id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}

export const storage = new DbStorage();
