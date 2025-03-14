"use server";

import { NextResponse } from "next/server";

import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getDatesInBetween(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export async function GET(request: Request, { params }: { params: { itemId: string } }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: Messages.ERROR_USER_NOT_LOGGED_IN }, { status: 401 });
  }

  const loans = await prisma.loan.findMany({
    where: {
      itemId: parseInt(params.itemId),
      isApproved: true,
    },
  });

  let blockedDates: Date[] = [];

  for (let i = 0; i < loans.length; i++) {
    blockedDates = blockedDates.concat(getDatesInBetween(loans[i].startAt, loans[i].endAt));
  }

  const response = {
    itemId: params.itemId,
    blockedDates,
  };

  return NextResponse.json(response);
}
