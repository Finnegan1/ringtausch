"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteBorrowRequest(loanId: number) {
  try {
    // get user data
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("User not logged in");
    }
    console.log("loanId", loanId);
    // Perform the deletion operation in the database
    // maybe we want to deactivate the request instead of deleting it??
    const deletedLoan = await prisma.loan.delete({
      where: {
        id: Number(loanId),
        borrowerId: session.user.id,
        isBorrowed: false,
        isFinished: false,
      },
    });
    console.log("Loan deleted successfully:", deletedLoan);

    return "deleted loan request successfully";
  } catch (error) {
    console.error("Error deleting loan:", error);
    throw new Error("Internal Server Error");
  }
}
