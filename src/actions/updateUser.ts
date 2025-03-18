"use server";

import { User } from "@prisma/client";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateUserData(data: User) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("User not logged in");
    }

    try {
      const update = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data,
      });
      return update;
    } catch {
      throw new Error("User update failed");
    }
  } catch {
    throw new Error("Internal Server Error");
  }
}
