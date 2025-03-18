import { NextResponse } from "next/server";

import { getPoints } from "@/actions/points";
import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: Messages.ERROR_USER_NOT_LOGGED_IN }, { status: 401 });
  }

  const borrowerId = session.user.id;

  const newLoan = {
    borrowerId,
    itemId: body.itemId,
    startAt: new Date(body.startAt),
    endAt: new Date(body.endAt),
    borrowerMessage: body.message,
  };

  const points = await getPoints();

  if (points <= 0) {
    return NextResponse.json({ error: "Du hast nicht genügend Punkte!" }, { status: 400 });
  }

  const loan = await prisma.loan.create({
    data: newLoan,
  });

  return NextResponse.json(loan);
}
