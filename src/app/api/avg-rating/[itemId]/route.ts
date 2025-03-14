"use server";

import { NextResponse } from "next/server";

import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { itemId: string } }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: Messages.ERROR_USER_NOT_LOGGED_IN }, { status: 401 });
  }

  // get average rating of item with the given id:
  const loans = await prisma.loan.aggregate({
    _avg: {
      borrowerSatisfaction: true,
    },
    where: {
      itemId: parseInt(params.itemId),
      borrowerSatisfaction: {
        not: null,
      },
    },
  });
  const avgRating = loans._avg.borrowerSatisfaction;

  const response = {
    itemId: params.itemId,
    avgRating,
  };

  return NextResponse.json(response);
}
