import { NextResponse } from "next/server";

import { postalCodes } from "@/constants/postal-codes";

export async function GET(request: Request, { params }: { params: { postalCode: string } }) {
  const postalCode = params.postalCode;

  if (!/^\d{5}$/.test(postalCode)) {
    return NextResponse.json(
      {
        valid: false,
        error: "invalid format. The postal code must consist of 5 digits",
      },
      { status: 400 }
    );
  }

  const result = postalCodes[postalCode];

  if (result) {
    return NextResponse.json({
      valid: true,
      name: result.name,
      neighbors: result.neighbors,
    });
  }

  return NextResponse.json({
    valid: false,
    error: "postal code not found",
  });
}
