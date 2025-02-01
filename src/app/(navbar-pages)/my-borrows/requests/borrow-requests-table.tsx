"use client";

import { FullDataTable } from "@/components/general/full-data-table";

import type { Requests } from "./columns";
import { columns } from "./columns";

interface TableSectionProps {
  data: Requests[];
}

export function BorrowRequestsTable({ data }: TableSectionProps) {
  return (
    <div className="mt-6">
      <FullDataTable columns={columns} data={data} />
    </div>
  );
}
