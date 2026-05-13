import { create } from "zustand";
import api from "../api/axios";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
}
interface TaskStore {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  createTask: (task: Omit<Task, "id">) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  fetchTasks: async () => {
    const res = await api.get("/tasks");
    set({ tasks: res.data.data });
  },
  createTask: async (task) => {
    await api.post("/tasks", task);
    const res = await api.get("/tasks");
    set({ tasks: res.data.data });
  },
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
}));
