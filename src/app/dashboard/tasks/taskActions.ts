"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const createTask = async (task: { title: string; description: string }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		redirect("/sign-in");
	}

	await prisma.task.create({
		data: {
			...task,
			userId: session.user.id,
		},
	});
};

export const updateCompleatStatus = async (taskId: number, completed: boolean) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		redirect("/sign-in");
	}

	await prisma.task.update({
		where: {
			id: taskId,
			userId: session.user.id,
		},
		data: {
			completed: completed,
		},
	});
};
