import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const itemCreateSchema = z.object({
  name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein"),
  description: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen lang sein"),
  files: z
    .array(
      z.object({
        file: z
          .custom<File>()
          .refine((file) => file instanceof File, "Invalid file")
          .refine((file) => file.size <= MAX_FILE_SIZE, "Datei überschreitet maximale Dateigröße")
          .refine((file) => file.type.startsWith("image/"), "Nur Bilddateien sind erlaubt"),
      })
    )
    .min(1, { message: "Mindestens eine Datei ist erforderlich." }),
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
          .refine((file) => file instanceof File, "Invalid file")
          .refine((file) => file.size <= MAX_FILE_SIZE, "Datei überschreitet maximale Dateigröße")
          .refine((file) => file.type.startsWith("image/"), "Nur Bilddateien sind erlaubt"),
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
