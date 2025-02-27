"use server";

import { NextResponse } from "next/server";

import { MyBorrows } from "@/components/specific/BorrowRequestsTable";
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
    return NextResponse.json({ error: "User not logged in" }, { status: 401 });
  }
  const borrowerId = session.user.id;

  // Determine which query to execute based on the filter
  let data: MyBorrows[] = [];
  if (filter === "pending") {
    const dataWithoutContact = await prisma.loan.findMany({
      where: {
        borrowerId,
        isInContact: false,
        isBorrowed: false,
        isFinished: false,
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
        item: {
          select: {
            name: true,
            pictures: true,
            description: true,
          },
        },
      },
    });

    const dataWithContact = await prisma.loan.findMany({
      where: {
        borrowerId,
        isInContact: true,
        isBorrowed: false,
        isFinished: false,
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
        item: {
          select: {
            name: true,
            pictures: true,
            description: true,
            owner: {
              select: {
                email: true,
                firstName: true,
              },
            },
          },
        },
      },
    });
    data = [...dataWithoutContact, ...dataWithContact];
  } else if (filter === "inProcess") {
    data = await prisma.loan.findMany({
      where: {
        borrowerId,
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
        borrowerSatisfaction: true,
        borrowerSatisfactionMessage: true,
        borrowerMessage: true,
        item: {
          select: {
            name: true,
            pictures: true,
            description: true,
            owner: {
              select: {
                email: true,
                firstName: true,
              },
            },
          },
        },
      },
    });
  } else if (filter === "finished") {
    data = await prisma.loan.findMany({
      where: {
        borrowerId,
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
        borrowerSatisfaction: true,
        borrowerSatisfactionMessage: true,
        borrowerMessage: true,
        item: {
          select: {
            name: true,
            pictures: true,
            description: true,
            owner: {
              select: {
                email: true,
                firstName: true,
              },
            },
          },
        },
      },
    });
  } else {
    data = [];
  }

  return NextResponse.json(data);
}
