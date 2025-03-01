"use server";

import { headers } from "next/headers";

import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function rate(loanId: number, rating: number, message: string) {
  try {
    // Authenticate the user making the call
    const session = await auth.api.getSession({
      headers: headers(),
    });
    if (!session?.user?.id) {
      throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
    }

    // Validate rating (must be between 1 and 5)
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      throw new Error(Messages.ERROR_RATING_INVALID);
    }

    // Retrieve the loan record by ID
    const loan = await prisma.loan.findUnique({
      where: { id: Number(loanId), borrowerId: session.user.id },
    });

    if (!loan) {
      throw new Error(Messages.ERROR_LOAN_NOT_FOUND);
    }
    // Check that the loan is finished
    if (!loan.isFinished) {
      throw new Error(Messages.ERROR_LOAN_NOT_FINISHED);
    }

    if (loan.borrowerSatisfaction !== null || loan.borrowerSatisfactionMessage !== null) {
      if (!loan.isFinished) {
        throw new Error(Messages.ERROR_LOAN_ALREADY_RATED);
      }
    }

    // Update the loan with the provided rating and message
    const updatedLoan = await prisma.loan.update({
      where: { id: Number(loanId) },
      data: {
        borrowerSatisfaction: rating,
        borrowerSatisfactionMessage: message,
      },
    });

    return updatedLoan;
  } catch {
    throw new Error(Messages.ERROR_INTERNAL_SERVER);
  }
}
