import { headers } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TableSection } from "./table-section";

export default async function MeineAngebote() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const items = await prisma.item.findMany({
    where: {
      ownerId: session?.user.id,
    },
    include: {
      owner: true,
    },
  });

  return (
    <div className="mx-10 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meine Angebote</h1>
        <Link href="/meine-angebote/erstellen" prefetch={true}>
          <Button>Neues Angebot</Button>
        </Link>
      </div>
      <TableSection data={items} />
    </div>
  );
}
