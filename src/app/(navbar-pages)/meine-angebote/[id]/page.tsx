import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { minioClient } from "@/lib/minio-client";
import { prisma } from "@/lib/prisma";

interface Props {
  params: {
    id: string;
  };
}

export default async function OfferingPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const item = await prisma.item.findUnique({
    where: {
      id: parseInt(params.id, 10),
      ownerId: session?.user.id,
    },
    include: {
      owner: true,
    },
  });

  if (!item) {
    notFound();
  }

  const urls = await Promise.all(
    item.picture
      ?.split(",")
      .map((fileId) => minioClient.presignedGetObject("public-item-images", fileId, 36000)) ?? []
  );

  return (
    <div className="mx-10 mt-6">
      <h1 className="text-2xl font-bold">{item.name}</h1>
      <div className="mt-4">
        <p className="text-gray-600">{item.description}</p>
        <p className="mt-2 text-sm text-gray-500">
          Erstellt am {item.createdAt.toLocaleDateString(["de"])}
        </p>
        {item.picture && (
          <div className="mt-4">
            {urls.map((url) => (
              <Image key={url} src={url} alt="Item" width={300} height={300} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
