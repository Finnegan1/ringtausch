"use server";

import { NextResponse } from "next/server";

import { MyLendings } from "@/components/specific/LendingRequestsTable";
import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Extract the filter from the URL query parameters
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "pending";

  // Authenticate the user
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: Messages.ERROR_USER_NOT_LOGGED_IN }, { status: 401 });
  }
  const ownerId = session.user.id;

  // Determine which query to execute based on the filter
  let data: MyLendings[] = [];
  if (filter === "pending") {
    // Pending requests - not borrowed, not finished, including contact exchanged items
    data = await prisma.loan.findMany({
      where: {
        item: {
          ownerId,
        },
        isBorrowed: false,
        isFinished: false,
        OR: [
          // Regular pending requests
          {
            isApproved: false,
            isInContact: false,
          },
          // Contact exchanged items (should also appear in Anfragen)
          {
            isApproved: true,
            isInContact: true,
          },
        ],
      },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        createdAt: true,
        isApproved: true,
        isInContact: true,
        borrowerSatisfaction: true,
        borrowerSatisfactionMessage: true,
        borrowerMessage: true,
        isBorrowed: true,
        isFinished: true,
        isOwnerConfirmed: true,
        isBorrowerConfirmed: true,
        borrower: {
          select: {
            email: true,
            firstName: true,
          },
        },
        item: {
          select: {
            id: true,
            name: true,
            pictures: true,
            description: true,
          },
        },
      },
    });
  } else if (filter === "inProcess") {
    // In process - currently borrowed items only
    const borrowedData = await prisma.loan.findMany({
      where: {
        item: {
          ownerId,
        },
        isBorrowed: true,
        isFinished: false,
      },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        createdAt: true,
        isApproved: true,
        isInContact: true,
        isBorrowed: true,
        isFinished: true,
        isOwnerConfirmed: true,
        isBorrowerConfirmed: true,
        borrowerSatisfaction: true,
        borrowerSatisfactionMessage: true,
        borrowerMessage: true,
        borrower: {
          select: {
            email: true,
            firstName: true,
          },
        },
        item: {
          select: {
            id: true,
            name: true,
            pictures: true,
            description: true,
          },
        },
      },
    });

    // Only include borrowed items in the inProcess tab
    data = borrowedData;
  } else if (filter === "finished") {
    // Finished loans
    data = await prisma.loan.findMany({
      where: {
        item: {
          ownerId,
        },
        isFinished: true,
      },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        createdAt: true,
        isApproved: true,
        isInContact: true,
        isBorrowed: true,
        isFinished: true,
        isOwnerConfirmed: true,
        isBorrowerConfirmed: true,
        borrowerSatisfaction: true,
        borrowerSatisfactionMessage: true,
        borrowerMessage: true,
        borrower: {
          select: {
            email: true,
            firstName: true,
          },
        },
        item: {
          select: {
            id: true,
            name: true,
            pictures: true,
            description: true,
          },
        },
      },
    });
  } else {
    data = [];
  }

  return NextResponse.json(data);
}
