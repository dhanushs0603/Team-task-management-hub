import express from "express";
import cors from "cors";
import taskRoutes from "../backend/src/routes/task_routes";
import { errorHandler } from "../backend/src/middleware/error_middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
