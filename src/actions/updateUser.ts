"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function updateUserData(data: {
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("User not logged in");
    }

    try {
      console.log(data);
      const update = await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          houseNumber: data.houseNumber,
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
        },
      });
      return update;
    } catch {
      throw new Error("User update failed");
    }
  } catch (e) {
    console.error(e);
    throw new Error("Internal Server Error");
  }
}
