"use server";

import { headers } from "next/headers";

import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getPoints() {
  const session = await auth.api.getSession({
    headers: headers(),
  });
  if (!session?.user?.id) {
    throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
  }

  const successfullyLent = await prisma.loan.count({
    where: {
      item: {
        ownerId: session.user.id,
      },
      isBorrowed: true,
    },
  });

  const successfullyBorrowed = await prisma.loan.count({
    where: {
      borrowerId: session.user.id,
      isBorrowed: true,
    },
  });

  const points = Math.max(0, successfullyLent - successfullyBorrowed + 3);

  return points;
}
