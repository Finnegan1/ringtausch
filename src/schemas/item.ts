import { z } from "zod";

import { Messages } from "@/constants/messages";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const itemCreateSchema = z.object({
  name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein"),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen lang sein"),
  files: z
    .array(
      z.object({
        file: z
          .custom<File>()
          .refine((file) => file instanceof File, Messages.ERROR_FILE_INVALID)
          .refine((file) => file.size <= MAX_FILE_SIZE, Messages.ERROR_FILE_TOO_LARGE)
          .refine((file) => file.type.startsWith("image/"), Messages.ERROR_FILE_NOT_IMAGE),
      })
    )
    .min(1, { message: Messages.ERROR_FILE_REQUIRED }),
});

export const itemUpdateSchema = z.object({
  name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein"),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen lang sein"),
  existingImages: z.array(z.string()).optional(),
  files: z
    .array(
      z.object({
        file: z
          .custom<File>()
          .refine((file) => file instanceof File, Messages.ERROR_FILE_INVALID)
          .refine((file) => file.size <= MAX_FILE_SIZE, Messages.ERROR_FILE_TOO_LARGE)
          .refine((file) => file.type.startsWith("image/"), Messages.ERROR_FILE_NOT_IMAGE),
      })
    )
    .optional(),
});

export const itemFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pictures: z.array(z.string()).optional(),
});

export type ItemCreateSchema = z.infer<typeof itemCreateSchema>;
export type ItemUpdateSchema = z.infer<typeof itemUpdateSchema>;
export type ItemFormSchema = z.infer<typeof itemFormSchema>;
