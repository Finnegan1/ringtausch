import Image from "next/image";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { minioClient } from "@/lib/minio-client";

export default async function DashboardPage() {
  const url = await minioClient.presignedGetObject(
    "images",
    "digitally-generated-image-of-isometric-data-chart.webp",
    36000
  );

  console.log(url);

  return (
    <div>
      <main className="container mx-auto py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Dashboard</CardTitle>
              <CardDescription>
                This is your dashboard where you can manage your account and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your dashboard content goes here.</p>
              <Image
                src={url}
                alt="Dashboard Image"
                width={1200}
                height={800}
                className="mt-4 h-auto w-full rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
