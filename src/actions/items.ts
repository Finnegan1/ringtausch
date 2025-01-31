"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  picture: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export async function createItem(data: FormValues) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error("You must be logged in to create an item");
  }

  const result = formSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  try {
    const item = await prisma.item.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        picture: result.data.picture,
        ownerId: session.user.id,
      },
    });
    return item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create item: ${error.message}`);
    }
    throw new Error("Failed to create item");
  }
}
