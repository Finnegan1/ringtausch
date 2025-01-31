"use server";

import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { auth } from "@/lib/auth";
import { minioClient } from "@/lib/minio-client";

/**
 * Get a presigned URL for uploading a file to a bucket
 * Can be used with the function `uploadFile` to upload a file to a bucket
 * @param bucket - The bucket to upload the file to
 * @param fileId - The ID the file will have in the bucket
 * @returns The presigned URL and the file ID
 */
export async function signedUploadUrl(
  bucket: string,
  fileId?: string
): Promise<{ presignedUrl: string; fileId: string }> {
  if (!fileId) {
    fileId = uuidv4();
  }

  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session) {
    throw new Error("You must be logged in to create an item");
  }

  try {
    const presignedUrl = await minioClient.presignedPutObject(bucket, fileId, 5 * 60);
    return { presignedUrl, fileId };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get presigned URL");
  }
}
