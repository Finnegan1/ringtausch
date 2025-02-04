import { NextResponse } from "next/server";

import { minioClient } from "@/lib/minio-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("imageId");

  if (!imageId) {
    return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
  }

  try {
    const presignedUrl = await minioClient.presignedGetObject("public-item-images", imageId, 36000);
    return NextResponse.json({ presignedUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get presigned URL" }, { status: 500 });
  }
}
