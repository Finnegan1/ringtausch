"use server";

// adjust the import path if necessary
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
// adjust the import path if necessary
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Authenticate the user making the call
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "User not logged in" }, { status: 401 });
    }

    const { loanId, rating, message } = await request.json();

    // Validate rating (must be between 1 and 5)
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    // Retrieve the loan record by ID
    const loan = await prisma.loan.findUnique({
      where: { id: Number(loanId) },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    // Ensure that the borrower is the one making the call
    if (loan.borrowerId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized: Not the borrower" }, { status: 403 });
    }

    // Check that the loan is finished
    if (!loan.isFinished) {
      return NextResponse.json({ error: "Loan is not finished yet" }, { status: 400 });
    }

    if (loan.borrowerSatisfaction !== null || loan.borrowerSatisfactionMessage !== null) {
      return NextResponse.json({ error: "Loan allready rated" }, { status: 400 });
    }

    // Update the loan with the provided rating and message
    const updatedLoan = await prisma.loan.update({
      where: { id: Number(loanId) },
      data: {
        borrowerSatisfaction: rating,
        borrowerSatisfactionMessage: message,
      },
    });

    return NextResponse.json({ success: true, updatedLoan });
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
