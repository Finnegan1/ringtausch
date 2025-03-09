"use server";

import { NextResponse } from "next/server";

import { Messages } from "@/constants/messages";
import { postalCodes } from "@/constants/postal-codes";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const neighborhood = searchParams.get("neighborhood") as "direct" | "extended";
  const itemName = searchParams.get("name") as string;

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: Messages.ERROR_USER_NOT_LOGGED_IN }, { status: 401 });
  }

  const neighborhoodPostalCodes: string[] = [session.user.postalCode];
  if (neighborhood === "extended") {
    neighborhoodPostalCodes.push(...postalCodes[session.user.postalCode].neighbors);
  }

  const neighbors = await prisma.user.findMany({
    where: {
      postalCode: {
        in: neighborhoodPostalCodes,
      },
    },
  });

  const items = await prisma.item.findMany({
    where: {
      ownerId: {
        in: neighbors.map((neighbor) => neighbor.id),
      },
      isDeleted: false,
      isActive: true,
      name: {
        contains: itemName,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      pictures: true,
      owner: {
        select: {
          postalCode: true,
        },
      },
    },
  });

  // add the postal code of the item's owner

  const response = {
    items: items,
    postalCodes: neighborhoodPostalCodes,
  };

  return NextResponse.json(response);
}
