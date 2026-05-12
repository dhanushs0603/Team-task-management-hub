import { Router } from "express";
import { getTasks, createTask, deleteTask } from "../controller/controller";
import { validateDeleteHeader } from "../middleware/auth_middleware";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", validateDeleteHeader, deleteTask);

export default router;
