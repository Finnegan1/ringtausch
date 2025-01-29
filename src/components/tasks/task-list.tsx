"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@prisma/client";

interface TaskListProps {
  tasks: Task[];
  onCheckedChange: (taskId: number, checked: boolean) => void;
}

export function TaskList({ tasks, onCheckedChange }: TaskListProps) {
  console.log(tasks);
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) => {
                  console.log(checked);
                  onCheckedChange(task.id!, !!checked);
                }}
              />
              <CardTitle
                className={
                  task.completed ? "line-through text-muted-foreground" : ""
                }
              >
                {task.title}
              </CardTitle>
            </div>
          </CardHeader>
          {task.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
