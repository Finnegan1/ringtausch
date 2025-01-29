import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import minioClient from "@/lib/minio-client";
import Image from "next/image";

export default async function DashboardPage() {
  const url = await minioClient.presignedGetObject(
    "images",
    "digitally-generated-image-of-isometric-data-chart.webp",
    36000
  );

  return (
    <div>
      <main className="container mx-auto py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Dashboard</CardTitle>
              <CardDescription>
                This is your dashboard where you can manage your account and
                settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Your dashboard content goes here.</p>
              <Image
                src={url}
                alt="Dashboard Image"
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg mt-4"
              />
            </CardContent>
          </Card>
          {/* Add more cards for different dashboard sections */}
        </div>
      </main>
    </div>
  );
}
