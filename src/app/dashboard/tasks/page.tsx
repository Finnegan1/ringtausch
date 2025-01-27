import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TasksClientPage from "./client-page";

export default async function TasksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <main className="container mx-auto py-6">
        <TasksClientPage tasks={tasks} />
      </main>
    </div>
  );
}
