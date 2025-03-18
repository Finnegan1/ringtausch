"use server";

import { Item } from "@prisma/client";
import { headers } from "next/headers";

import { Messages } from "@/constants/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ItemFormSchema, itemFormSchema } from "@/schemas/item";

export async function createItem(data: ItemFormSchema) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
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
        pictures: result.data.pictures,
        ownerId: session.user.id,
      },
    });
    return item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${Messages.ERROR_ITEM_CREATE}: ${error.message}`);
    }
    throw new Error(Messages.ERROR_ITEM_CREATE);
  }
}

export async function updateItem(id: number, data: ItemFormSchema) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
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
        pictures: result.data.pictures,
      },
    });
    return item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${Messages.ERROR_ITEM_UPDATE}: ${error.message}`);
    }
    throw new Error(Messages.ERROR_ITEM_UPDATE);
  }
}

export async function deleteItem(id: number) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
  }

  try {
    await prisma.item.delete({
      where: { id, ownerId: session.user.id },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${Messages.ERROR_ITEM_DELETE}: ${error.message}`);
    }
    throw new Error(Messages.ERROR_ITEM_DELETE);
  }
}

export async function getItem(id: number): Promise<Item> {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error(Messages.ERROR_USER_NOT_LOGGED_IN);
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id, ownerId: session.user.id },
    });

    if (!item) {
      throw new Error(Messages.ERROR_ITEM_NOT_FOUND);
    }

    return item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${Messages.ERROR_ITEM_GET}: ${error.message}`);
    }
    throw new Error(Messages.ERROR_ITEM_GET);
  }
}
