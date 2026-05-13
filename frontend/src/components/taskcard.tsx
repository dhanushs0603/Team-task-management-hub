import { useTaskStore } from "../store/taskstore";
import type { Task } from "../store/taskstore";

interface Props { task: Task;
}
const TaskCard = ({ task }: Props) => {
const deleteTask = useTaskStore((state) => state.deleteTask); return (

<div style={{ border: "1px solid gray", padding: 10 }}>
<h3>{task.title}</h3>
<p>{task.description}</p>
<p>Priority: {task.priority}</p>
<p>Status: {task.status}</p>
<button onClick={() => deleteTask(task.id)}> Delete
</button>
</div>
);
};
export default TaskCard;
