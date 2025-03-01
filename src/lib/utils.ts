import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Messages } from "@/constants/messages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Upload a file to a bucket using a presigned URL
 * @param file - The file to upload
 * @param presignedUrl - The presigned URL to upload the file to
 */
export async function uploadFile(file: File, presignedUrl: string) {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
  });

  if (!response.ok) {
    throw new Error(Messages.ERROR_FILE_UPLOAD);
  }
}

export function getPublicItemImageUrl(bucket: string, imageId: string) {
  return `${process.env.NEXT_PUBLIC_MINIO_URL}/${bucket}/${imageId}`;
}
