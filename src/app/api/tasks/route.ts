import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(tasks);

  return NextResponse.json(tasks);
}
