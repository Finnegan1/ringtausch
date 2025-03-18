"use client";

import { Prisma } from "@prisma/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ColumnDef, Row } from "@tanstack/react-table";
import { de } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteItem } from "@/actions/items";
import { FullDataTable } from "@/components/general/full-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Sheet, SheetContent, SheetFooter, SheetHeader } from "@/components/ui/sheet";
import { Time } from "@/components/ui/time";
import { Typography } from "@/components/ui/typography";
import { Messages } from "@/constants/messages";
import { toast } from "@/hooks/use-toast";
import { getPublicItemImageUrl } from "@/lib/utils";

export type Offering = Prisma.ItemGetPayload<{
  include: {
    owner: true;
  };
}>;

export const columns: ColumnDef<Offering>[] = [
  {
    accessorKey: "name",
    id: "Name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "description",
    id: "Beschreibung",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beschreibung" />,
  },
  {
    accessorKey: "createdAt",
    id: "Erstellungsdatum",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Erstellungsdatum" />,
    cell: ({ row }) => {
      const createdAt = row.getValue("Erstellungsdatum") as Date;
      return (
        <div>
          <Time locale={de}>{createdAt}</Time>
        </div>
      );
    },
  },
];

interface TableSectionProps {
  data: Offering[];
}

export function TableSection({ data }: TableSectionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<Row<Offering>>();

  const onDelete = async () => {
    try {
      if (!row?.original.id) {
        throw new Error(Messages.ERROR_ITEM_NOT_FOUND);
      }
      await deleteItem(row.original.id);
      setOpen(false);
      toast({
        title: Messages.SUCCESS_ITEM_DELETE,
      });
      router.refresh();
    } catch {
      toast({
        title: Messages.ERROR_ITEM_DELETE,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <FullDataTable
          columns={columns}
          data={data}
          onRowClick={(row) => {
            setOpen(true);
            setRow(row);
          }}
        />
        <SheetContent className="flex flex-col items-center justify-between overflow-y-auto">
          <SheetHeader className="space-y-6">
            <DialogTitle asChild>
              <Typography variant="h2" className="border-none">
                {row?.original.name || "Angebotsdetails"}
              </Typography>
            </DialogTitle>
            <Typography variant="muted">
              Erstellt am {row?.original.createdAt.toLocaleDateString("de-DE")}
            </Typography>

            <div className="grid gap-2 pb-4">
              <Typography variant="h4">Beschreibung</Typography>
              <Typography variant="p" className="mt-0">
                {row?.original.description}
              </Typography>
            </div>

            {row?.original.pictures && (
              <div className="flex items-center justify-center">
                <div className="w-1/2">
                  <Carousel className="w-full max-w-sm">
                    <CarouselContent>
                      {row.original.pictures.map((imageId) => (
                        <CarouselItem key={imageId} className="basis-full">
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center overflow-hidden p-0">
                                <div className="relative flex h-full w-full items-center justify-center">
                                  <Image
                                    src={getPublicItemImageUrl("public-item-images", imageId)}
                                    alt={row.original.name}
                                    width={1000}
                                    height={1000}
                                    className="h-full w-full overflow-hidden object-cover"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            )}
          </SheetHeader>
          <SheetFooter className="mt-6">
            <div className="flex w-full gap-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => router.push(`/meine-angebote/${row?.original.id}/bearbeiten`)}
              >
                Bearbeiten
              </Button>
              <Button variant="destructive" onClick={() => onDelete()}>
                Löschen
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
