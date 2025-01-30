"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  DataTable,
  DataTableFilterOptions,
  DataTablePagination,
  DataTableViewOptions,
} from "@/components/ui/data-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

/**
 * A pre-configured data table component that includes sorting, filtering, pagination, and column visibility options.
 *
 * Features:
 * - Column sorting
 * - Text filtering
 * - Pagination
 * - Column visibility toggle
 * - Responsive design
 *
 * @example
 * ```tsx
 * // Define your columns
 * const columns: ColumnDef<YourDataType>[] = [
 *   {
 *     accessorKey: "name",
 *     header: ({ column }) => (
 *       <DataTableColumnHeader column={column} title="Name" />
 *     ),
 *   },
 *   {
 *     accessorKey: "email",
 *     header: ({ column }) => (
 *       <DataTableColumnHeader column={column} title="Email" />
 *     ),
 *   },
 * ];
 *
 * // Use the component
 * export default function YourComponent() {
 *   const data = [...]; // Your data array
 *
 *   return (
 *     <FullDataTable
 *       columns={columns}
 *       data={data}
 *     />
 *   );
 * }
 * ```
 *
 * @param props.columns - Array of column definitions using TanStack Table's ColumnDef
 * @param props.data - Array of data objects to display in the table
 * @returns A fully featured data table component with sorting, filtering, and pagination
 */
export function FullDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <DataTableFilterOptions table={table} data={data} />
        <DataTableViewOptions table={table} />
      </div>
      <DataTable table={table} className="my-4" />
      <DataTablePagination table={table} />
    </div>
  );
}
