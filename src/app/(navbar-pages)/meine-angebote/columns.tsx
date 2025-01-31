"use client";

import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { de } from "date-fns/locale";

import { DataTableColumnHeader } from "@/components/ui/data-table";
import { Time } from "@/components/ui/time";

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
