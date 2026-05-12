export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "TODO" | "IN_PROGRESS" | "DONE";
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
}
