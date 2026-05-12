import { Task } from "../models/task_model";

export const tasks: Task[] = [
  {
    id: "1",
    title: "Setup project",
    description: "Initialize repository and install dependencies",
    priority: "HIGH",
    status: "DONE",
  },
  {
    id: "2",
    title: "Create login page",
    description: "Design and implement authentication UI",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
  },
  {
    id: "3",
    title: "Write API integration",
    priority: "HIGH",
    status: "TODO",
  },
];
