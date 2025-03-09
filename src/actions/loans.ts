"use server";

import { headers } from "next/headers";

import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function confirmBorrow(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
    }

    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(loanId),
        borrowerId: session.user.id,
      },
    });

    if (!loan) {
      throw new Error(Messages.ERROR_LOAN_NOT_FOUND);
    }

    if (!loan.isInContact || !loan.isApproved) {
      throw new Error(Messages.ERROR_LOAN_STATUS);
    }

    try {
      await prisma.loan.update({
        where: { id: Number(loanId), borrowerId: session.user.id },
        data: { isBorrowed: true },
      });
    } catch {
      throw new Error(Messages.ERROR_LOAN_UPDATE);
    }

    return "Confirmed borrow successfully";
  } catch {
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}

export async function deleteBorrowRequest(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
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
      throw new Error(Messages.ERROR_LOAN_UPDATE);
    }

    return "deleted loan request successfully";
  } catch {
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}
