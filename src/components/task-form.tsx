"use client";

import { useQueryState } from "nuqs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskFormProps {
	onSubmit: (task: { title: string; description: string }) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
	const [title, setTitle] = useQueryState("title", { defaultValue: "" });
	const [description, setDescription] = useQueryState("description", {
		defaultValue: "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit({ title, description });
			setTitle("");
			setDescription("");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add New Task</CardTitle>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Task title"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Task description"
							rows={3}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={loading}>
						{loading ? "Adding..." : "Add Task"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
