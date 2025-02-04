"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function confirmBorrow(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("User not logged in");
    }

    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(loanId),
        borrowerId: session.user.id,
      },
    });

    if (!loan) {
      throw new Error("Loan not found");
    }

    if (!loan.isInContact || !loan.isApproved) {
      throw new Error("Loan is not in contact or not approved");
    }

    try {
      await prisma.loan.update({
        where: { id: Number(loanId), borrowerId: session.user.id },
        data: { isBorrowed: true },
      });
    } catch {
      throw new Error("Loan update failed");
    }

    return "Confirmed borrow successfully";
  } catch {
    throw new Error("Internal Server Error");
  }
}

export async function deleteBorrowRequest(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("User not logged in");
    }

    // TODO: Perform the deletion operation in the database
    // TODO: maybe we want to deactivate the request instead of deleting it??
    try {
      await prisma.loan.delete({
        where: {
          id: Number(loanId),
          borrowerId: session.user.id,
          isBorrowed: false,
          isFinished: false,
        },
      });
    } catch {
      throw new Error("Loan update failed");
    }

    return "deleted loan request successfully";
  } catch {
    throw new Error("Internal Server Error");
  }
}
