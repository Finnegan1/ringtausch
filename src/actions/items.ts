"use server";

import { Item } from "@prisma/client";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ItemFormSchema, itemFormSchema } from "@/schemas/item";

export async function createItem(data: ItemFormSchema) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error("You must be logged in to create an item");
  }

  const result = itemFormSchema.safeParse(data);

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

export async function updateItem(id: number, data: ItemFormSchema) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error("You must be logged in to update an item");
  }

  const result = itemFormSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }

  try {
    const item = await prisma.item.update({
      where: { id, ownerId: session.user.id },
      data: {
        name: result.data.name,
        description: result.data.description,
        picture: result.data.picture,
      },
    });
    return item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update item: ${error.message}`);
    }
    throw new Error("Failed to update item");
  }
}

export async function deleteItem(id: number) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error("You must be logged in to delete an item");
  }

  try {
    await prisma.item.delete({
      where: { id, ownerId: session.user.id },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete item: ${error.message}`);
    }
    throw new Error("Failed to delete item");
  }
}

export async function getItem(id: number): Promise<Item> {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error("You must be logged in to get an item");
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id, ownerId: session.user.id },
    });

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get item: ${error.message}`);
    }
    throw new Error("Failed to get item");
  }
}
