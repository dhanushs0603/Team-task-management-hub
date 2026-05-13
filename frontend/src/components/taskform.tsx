import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { taskSchema } from "../schema/taskschema";
import type { TaskFormData } from "../schema/taskschema";
import { useTaskStore } from "../store/taskstore";

import "./TaskForm.css";

const TaskForm = () => {
  const createTask = useTaskStore((state) => state.createTask);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: TaskFormData) => {
    await createTask(data);
  };

  return (
    <div className="task-container">
      <form
        className="task-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="task-title">Create Task</h2>

        <div className="form-group">
          <input
            type="text"
            placeholder="Enter title"
            {...register("title")}
          />
          {errors.title && (
            <p className="error">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <textarea
            placeholder="Enter description"
            {...register("description")}
          />
        </div>

        <div className="form-group">
          <select {...register("priority")}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div className="form-group">
          <select {...register("status")}>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">
              IN_PROGRESS
            </option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <button type="submit">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;