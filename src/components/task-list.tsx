"use client";

// Remove the import of Selectable from Kysely
// import { Selectable } from "kysely";
// Import the Task type from Prisma
import { Task } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskListProps {
	// Use the Task type from Prisma
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
							<CardTitle className={task.completed ? "text-muted-foreground line-through" : ""}>
								{task.title}
							</CardTitle>
						</div>
					</CardHeader>
					{task.description && (
						<CardContent>
							<p className="text-sm text-muted-foreground">{task.description}</p>
						</CardContent>
					)}
				</Card>
			))}
		</div>
	);
}
