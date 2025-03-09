"use server";

import { headers } from "next/headers";

import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function acceptLendingRequest(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
    }

    const ownerId = session.user.id;

    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(loanId),
      },
      include: {
        item: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!loan) {
      throw new Error(Messages.ERROR_LOAN_NOT_FOUND);
    }

    if (loan.item.ownerId !== ownerId) {
      throw new Error(Messages.ERROR_UNAUTHORIZED);
    }

    await prisma.loan.update({
      where: { id: Number(loanId) },
      data: {
        isApproved: true,
        isInContact: true,
      },
    });

    return "Lending request accepted successfully";
  } catch (error) {
    console.error("Error accepting lending request:", error);
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}

export async function confirmBorrowing(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
    }

    const ownerId = session.user.id;

    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(loanId),
      },
      include: {
        item: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!loan) {
      throw new Error(Messages.ERROR_LOAN_NOT_FOUND);
    }

    if (loan.item.ownerId !== ownerId) {
      throw new Error(Messages.ERROR_UNAUTHORIZED);
    }

    // Check if the loan is in the correct state
    if (!loan.isApproved || !loan.isInContact || loan.isBorrowed || loan.isFinished) {
      throw new Error(Messages.ERROR_LOAN_STATUS);
    }

    // Update the loan to automatically mark owner confirmation
    // and set isBorrowed to true if the borrower has already confirmed
    await prisma.loan.update({
      where: { id: Number(loanId) },
      data: {
        isOwnerConfirmed: true,
        isBorrowed: loan.isBorrowerConfirmed === true,
      },
    });

    return "Item marked as ready for pickup";
  } catch (error) {
    console.error("Error confirming borrowing:", error);
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}

export async function confirmBorrowingByBorrower(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
    }

    const borrowerId = session.user.id;

    // Find the loan and verify that the current user is the borrower
    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(loanId),
        borrowerId: borrowerId,
      },
    });

    if (!loan) {
      throw new Error(Messages.ERROR_LOAN_NOT_FOUND);
    }

    // Check if the loan is in the correct state
    if (!loan.isApproved || !loan.isInContact || loan.isBorrowed || loan.isFinished) {
      throw new Error(Messages.ERROR_LOAN_STATUS);
    }

    // Update the loan to mark borrower confirmation and set isBorrowed to true
    // Since we no longer require owner confirmation, we can set isBorrowed directly
    await prisma.loan.update({
      where: { id: Number(loanId) },
      data: {
        isBorrowerConfirmed: true,
        isBorrowed: true,
      },
    });

    return "Item receipt confirmed successfully";
  } catch (error) {
    console.error("Error confirming borrowing by borrower:", error);
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}

export async function rejectLendingRequest(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
    }

    const ownerId = session.user.id;

    // Find the loan and verify that the current user is the owner of the item
    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(loanId),
      },
      include: {
        item: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!loan) {
      throw new Error(Messages.ERROR_LOAN_NOT_FOUND);
    }

    if (loan.item.ownerId !== ownerId) {
      throw new Error(Messages.ERROR_UNAUTHORIZED);
    }

    // Delete the loan request
    await prisma.loan.delete({
      where: { id: Number(loanId) },
    });

    return "Lending request rejected successfully";
  } catch (error) {
    console.error("Error rejecting lending request:", error);
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}

export async function confirmReturn(loanId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
    }

    const ownerId = session.user.id;

    // Find the loan and verify that the current user is the owner of the item
    const loan = await prisma.loan.findUnique({
      where: {
        id: Number(loanId),
      },
      include: {
        item: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!loan) {
      throw new Error(Messages.ERROR_LOAN_NOT_FOUND);
    }

    if (loan.item.ownerId !== ownerId) {
      throw new Error(Messages.ERROR_UNAUTHORIZED);
    }

    if (!loan.isBorrowed || loan.isFinished) {
      throw new Error(Messages.ERROR_LOAN_STATUS);
    }

    // Update the loan to be finished
    await prisma.loan.update({
      where: { id: Number(loanId) },
      data: {
        isFinished: true,
        isOwnerConfirmed: false,
        isBorrowerConfirmed: false,
      },
    });

    return "Return confirmed successfully";
  } catch (error) {
    console.error("Error confirming return:", error);
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}
