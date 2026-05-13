import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { tasks } from "../data/tasks";
import { taskSchema } from "../validator/task_validator";

export const getTasks = (req: Request, res: Response) => {
  res.json({ success: true, data: tasks });
};

export const createTask = (req: Request, res: Response) => {
  const validated = taskSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({
      success: false,
      errors: validated.error.flatten(),
    });
  }
  const task = { id: uuid(), ...validated.data };
  tasks.push(task);
  res.status(201).json({ success: true, data: task });
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }
  tasks.splice(index, 1);
  res.json({ success: true, message: "Task deleted successfully" });
};
