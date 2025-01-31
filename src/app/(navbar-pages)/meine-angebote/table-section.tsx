"use client";

import { useRouter } from "next/navigation";

import { FullDataTable } from "@/components/general/full-data-table";

import type { Offering } from "./columns";
import { columns } from "./columns";

interface TableSectionProps {
  data: Offering[];
}

export function TableSection({ data }: TableSectionProps) {
  const router = useRouter();

  return (
    <div className="mt-6">
      <FullDataTable
        columns={columns}
        data={data}
        onRowClick={(row) => router.push(`/meine-angebote/${row.original.id}`)}
      />
    </div>
  );
}
