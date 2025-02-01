import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { BorrowRequestsTable } from "./requests/borrow-requests-table";

export default async function MyBorrowRequests() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("User not logged in.");
  }

  const loanRequests = await prisma.loan.findMany({
    where: {
      borrowerId: session.user.id,
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
      item: {
        select: {
          name: true,
          picture: true,
        },
      },
    },
  });
  const loanInProcess = await prisma.loan.findMany({
    where: {
      borrowerId: session.user.id,
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
      item: {
        select: {
          name: true,
          picture: true,
        },
      },
    },
  });
  const loanFinished = await prisma.loan.findMany({
    where: {
      borrowerId: session.user.id,
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
      item: {
        select: {
          name: true,
          picture: true,
        },
      },
    },
  });

  return (
    <div className="mx-10 mt-6">
      <BorrowRequestsTable data={loanRequests} />
      <BorrowRequestsTable data={loanInProcess} />
      <BorrowRequestsTable data={loanFinished} />
    </div>
  );
}
