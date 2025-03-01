import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { UserForm } from "./form";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  const userData = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  return <UserForm initialData={userData!} />;
}
