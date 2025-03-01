"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { ErrorCode, FileRejection } from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";

import { signedUploadUrl } from "@/actions/files";
import { createItem } from "@/actions/items";
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
import { uploadFile } from "@/lib/utils";
import { ItemCreateSchema, MAX_FILE_SIZE, itemCreateSchema } from "@/schemas/item";

export default function Erstellen() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ItemCreateSchema>({
    resolver: zodResolver(itemCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      files: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "files",
  });

  async function onSubmit(data: ItemCreateSchema) {
    setIsSubmitting(true);
    try {
      const fileIds: string[] = [];
      try {
        for (const file of data.files) {
          const { presignedUrl, fileId } = await signedUploadUrl("public-item-images");
          fileIds.push(fileId);
          await uploadFile(file.file, presignedUrl);
        }
      } catch (error) {
        console.error(error);
      }

      await createItem({
        name: data.name,
        description: data.description,
        pictures: fileIds,
      });

      toast({
        title: "Erfolg!",
        description: "Dein Angebot wurde erstellt.",
      });

      router.push("/meine-angebote");
      router.refresh();
    } catch {
      toast({
        title: "Fehler",
        description: "Angebot konnte nicht erstellt werden. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const onDropAccepted = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      append({ file });
    });
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections.forEach((fileRejection) => {
      if (fileRejection.errors.some((err) => err.code === ErrorCode.FileTooLarge)) {
        toast({
          variant: "destructive",
          title: "Datei zu groß.",
          description: `Datei '${fileRejection.file.name}' ist zu groß.`,
        });
      }
    });
  };

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Neues Angebot erstellen</CardTitle>
            <CardDescription>
              Teile deinen Gegenstand mit anderen im Verleih-Marktplatz
            </CardDescription>
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
                          <Input placeholder="Akkubohrer" {...field} />
                        </FormControl>
                        <FormDescription>
                          Der Name des Gegenstands, den du verleihen möchtest
                        </FormDescription>
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
                          <Textarea
                            placeholder="Beschreibe deinen Gegenstand im Detail..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Gib Details zum Zustand und zur Nutzung deines Gegenstands an
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
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
                            <FormLabel>Dateien hochladen</FormLabel>
                            <DropzoneZone className="flex justify-center">
                              <FormControl>
                                <DropzoneInput
                                  disabled={field.disabled}
                                  name={field.name}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
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
                            <FormDescription>Drag and Drop wird unterstützt.</FormDescription>
                            {!!fields.length && (
                              <div className="grid gap-4">
                                <FileList className="mt-4">
                                  {fields.map((field, index) => (
                                    <FileListEntry
                                      key={field.id}
                                      name={field.file.name}
                                      size={field.file.size}
                                      objectUrl={URL.createObjectURL(field.file)}
                                      onRemove={() => remove(index)}
                                    />
                                  ))}
                                </FileList>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </Dropzone>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
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
                    Angebot erstellen
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
