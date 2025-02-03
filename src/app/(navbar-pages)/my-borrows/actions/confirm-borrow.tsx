"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function confirmBorrow(loanId: number) {
  try {
    // Authenticate the user making the call
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("User not logged in");
    }

    // Retrieve the loan record by ID
    const loan = await prisma.loan.findUnique({
      where: { id: Number(loanId) },
    });

    if (!loan) {
      throw new Error("Loan not found");
    }

    // Ensure that the borrower is the one making the call
    if (loan.borrowerId !== session.user.id) {
      throw new Error("Unauthorized: Not the borrower");
    }

    // Check that isInContact and isApproved are true
    if (!loan.isInContact || !loan.isApproved) {
      throw new Error("Loan is not in contact or not approved");
    }

    // Update the loan by setting isBorrowed to true
    const updatedLoan = await prisma.loan.update({
      where: { id: Number(loanId) },
      data: { isBorrowed: true },
    });
    console.log("Loan updated successfully:", updatedLoan);
    return "Confirmed borrow successfully";
  } catch (error) {
    console.error("Error updating loan:", error);
    throw new Error("Internal Server Error");
  }
}
