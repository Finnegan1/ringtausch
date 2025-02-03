"use server";

// adjust the path if necessary
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
// adjust the path if necessary
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse the request body to retrieve the loanId
    const { loanId } = await request.json();

    // Authenticate the user making the call
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "User not logged in" }, { status: 401 });
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

    // Check that isInContact and isApproved are true
    if (!loan.isInContact || !loan.isApproved) {
      return NextResponse.json(
        { error: "Loan is not in contact or not approved" },
        { status: 400 }
      );
    }

    // Update the loan by setting isBorrowed to true
    const updatedLoan = await prisma.loan.update({
      where: { id: Number(loanId) },
      data: { isBorrowed: true },
    });

    return NextResponse.json({ success: true, updatedLoan });
  } catch (error) {
    console.error("Error updating loan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
