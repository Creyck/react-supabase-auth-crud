import { useState } from "react";
import { useTasks } from "../context/TaskContext";

function TaskForm() {
  const [taskName, setTaskName] = useState("");
  const { createTask, adding } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskName.trim()) return; // evita tareas vacías

    await createTask(taskName);
    setTaskName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="card card-body">
        <input
          type="text"
          name="taskName"
          placeholder="Write a task name"
          className="form-control mb-2"
          onChange={(e) => setTaskName(e.target.value)}
          value={taskName}
        />

        <div className="ms-auto">
          <button className="btn btn-success" disabled={adding}>
            {adding ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
