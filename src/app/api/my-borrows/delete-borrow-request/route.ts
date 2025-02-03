import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  "use server";
  try {
    // get user data
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Parse the request body to retrieve the loanId
    const { loanId } = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("loanId", loanId);
    // Perform the deletion operation in the database
    // maybe we want to deactivate the request instead of deleting it??
    const deletedLoan = await prisma.loan.delete({
      where: {
        id: Number(loanId), // Convert loanId to number if needed
        borrowerId: session.user.id,
        isBorrowed: false,
        isFinished: false,
      },
    });

    return NextResponse.json({ success: true, deletedLoan });
  } catch (error) {
    console.error("Error deleting loan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
