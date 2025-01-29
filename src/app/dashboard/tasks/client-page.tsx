"use client";

import { Task } from "@prisma/client";
import { createTask, updateCompleatStatus } from "./taskActions";
import { useState } from "react";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";

export default function TasksClientPage({ tasks }: { tasks: Task[] }) {
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);

  const handleCreateTask = async (task: {
    title: string;
    description: string;
  }) => {
    await createTask(task);
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setCurrentTasks(data));
  };

  const handleUpdateCompleted = async (taskId: number, completed: boolean) => {
    await updateCompleatStatus(taskId, completed);
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setCurrentTasks(data));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <TaskForm onSubmit={handleCreateTask} />
      </div>
      <div>
        <TaskList
          tasks={currentTasks}
          onCheckedChange={handleUpdateCompleted}
        />
      </div>
    </div>
  );
}
