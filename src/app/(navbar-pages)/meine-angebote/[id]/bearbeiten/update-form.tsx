"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { ErrorCode, FileRejection } from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";

import { signedUploadUrl } from "@/actions/files";
import { updateItem } from "@/actions/items";
import { FileListEntry } from "@/components/general/FileListEntrie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dropzone,
  DropzoneDescription,
  DropzoneInput,
  DropzoneTitle,
  DropzoneUploadIcon,
  DropzoneZone,
} from "@/components/ui/dropzone";
import { FileList } from "@/components/ui/file-list";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getPublicItemImageUrl, uploadFile } from "@/lib/utils";
import { ItemUpdateSchema, MAX_FILE_SIZE, itemUpdateSchema } from "@/schemas/item";

interface UpdateFormProps {
  initialData: Item;
}

export function UpdateForm({ initialData }: UpdateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ItemUpdateSchema>({
    resolver: zodResolver(itemUpdateSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description ?? "",
      existingImages: initialData.pictures,
      files: [],
    },
  });

  const {
    fields: newFileFields,
    append: appendNewFile,
    remove: removeNewFile,
  } = useFieldArray({
    control: form.control,
    name: "files",
  });

  async function onSubmit(data: ItemUpdateSchema) {
    setIsSubmitting(true);
    try {
      const existingImages = data.existingImages || [];
      const newFileIds: string[] = [];

      if (data.files && data.files.length > 0) {
        try {
          for (const file of data.files) {
            const { presignedUrl, fileId } = await signedUploadUrl("public-item-images");
            newFileIds.push(fileId);
            await uploadFile(file.file, presignedUrl);
          }
        } catch (error) {
          console.error(error);
        }
      }

      await updateItem(initialData.id, {
        name: data.name,
        description: data.description,
        pictures: [...existingImages, ...newFileIds],
      });

      toast({
        title: "Erfolg!",
        description: "Dein Angebot wurde aktualisiert.",
      });

      router.push("/meine-angebote");
      router.refresh();
    } catch {
      toast({
        title: "Fehler",
        description: "Angebot konnte nicht aktualisiert werden. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onDropAccepted = (acceptedFiles: File[]) => {
    appendNewFile(acceptedFiles.map((file) => ({ file })));
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections.forEach((fileRejection) => {
      if (fileRejection.errors.some((err) => err.code === ErrorCode.FileTooLarge)) {
        toast({
          variant: "destructive",
          title: "Datei zu groß",
          description: `Datei '${fileRejection.file.name}' ist zu groß.`,
        });
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Angebot bearbeiten</CardTitle>
          <CardDescription>Aktualisiere die Details deines Angebots</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Der Name des Gegenstands</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschreibung</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[120px] resize-none" {...field} />
                      </FormControl>
                      <FormDescription>Details zum Zustand und zur Nutzung</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Dropzone
                  maxSize={MAX_FILE_SIZE}
                  onDropAccepted={onDropAccepted}
                  onDropRejected={onDropRejected}
                  accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                >
                  {({ maxSize }) => (
                    <FormField
                      control={form.control}
                      name="files"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neue Bilder</FormLabel>
                          <DropzoneZone>
                            <FormControl>
                              <DropzoneInput
                                name={field.name}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                disabled={field.disabled}
                              />
                            </FormControl>
                            <div className="flex items-center gap-6">
                              <DropzoneUploadIcon />
                              <div className="grid gap-0.5">
                                <DropzoneTitle>Zum Hochladen durchsuchen</DropzoneTitle>
                                <DropzoneDescription>
                                  {`Maximale Dateigröße: ${prettyBytes(maxSize ?? 0)}`}
                                </DropzoneDescription>
                              </div>
                            </div>
                          </DropzoneZone>
                          <FormDescription>Drag and Drop wird unterstützt</FormDescription>
                          <FormMessage />
                          <FileList>
                            {newFileFields.map((field, index) => (
                              <FileListEntry
                                key={field.id}
                                name={field.file.name}
                                size={field.file.size}
                                objectUrl={URL.createObjectURL(field.file)}
                                onRemove={() => removeNewFile(index)}
                              />
                            ))}
                          </FileList>
                        </FormItem>
                      )}
                    />
                  )}
                </Dropzone>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="existingImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vorhandene Bilder</FormLabel>
                      <FormControl>
                        <FileList>
                          {(field.value || []).map((imageId, index) => (
                            <FileListEntry
                              key={imageId}
                              name={imageId}
                              objectUrl={getPublicItemImageUrl("public-item-images", imageId)}
                              onRemove={() => {
                                const newImages = [...(field.value || [])];
                                newImages.splice(index, 1);
                                field.onChange(newImages);
                              }}
                            />
                          ))}
                        </FileList>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-end gap-4"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/meine-angebote")}
                >
                  Abbrechen
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Angebot aktualisieren
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
