import { useEffect, useMemo, useState } from "react";
import TaskForm from "../components/taskform";
import TaskList from "../components/tasklist";
import SearchBar from "../components/searchbar";
import { useTaskStore } from "../store/taskstore";

const Dashboard = () => {
const { tasks, fetchTasks } = useTaskStore(); const [search, setSearch] = useState("");
useEffect(() => { fetchTasks();
}, []);
const filteredTasks = useMemo(() => { return tasks.filter((task) =>
task.title.toLowerCase().includes(search.toLowerCase())
);
}, [tasks, search]);
return (
<div>
<h1>Team Task Management Hub</h1>
<TaskForm />
<SearchBar value={search} onChange={setSearch} />
<TaskList tasks={filteredTasks} />
</div>
);
};
export default Dashboard;