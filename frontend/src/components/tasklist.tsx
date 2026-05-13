import TaskCard from "./taskcard";
import type { Task } from "../store/taskstore";

interface Props { tasks: Task[];
}
const TaskList = ({ tasks }: Props) => { return (
<div>
{tasks.map((task) => (
<TaskCard key={task.id} task={task} />
))}
</div>
);
};
export default TaskList;