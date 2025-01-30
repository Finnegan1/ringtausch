"use client";

import { Column, Row, Table as TanTable, flexRender } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  EyeOff,
  Settings2,
} from "lucide-react";
import { HTMLAttributes, useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface DataTableProps<TData> extends HTMLAttributes<HTMLDivElement> {
  table: TanTable<TData>;
  onRowClick?: (entrie: Row<TData>) => void;
}

export function DataTable<TData>({
  table,
  onRowClick,
  className,
  ...divProps
}: DataTableProps<TData>) {
  return (
    <div className={cn("rounded-md border", className)} {...divProps}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface DataTableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

/**
 * Column Header for a Data Table.
 *
 * @example
 * ```tsx
 * export const columns = [
 *   {
 *     accessorKey: "email",
 *     id: "Email"
 *     header: ({ column }) => (
 *       <DataTableColumnHeader column={column} title="Email" />
 *     ),
 *   },
 * ] as ColumnDef<YourDataType>[];
 * ```
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface DataTablePaginationProps<TData> extends HTMLAttributes<HTMLDivElement> {
  table: TanTable<TData>;
}

/**
 * Pagination of a data Table
 */
export function DataTablePagination<TData>({
  table,
  className,
  ...divAttributes
}: DataTablePaginationProps<TData>) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)} {...divAttributes}>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DataTableViewOptionsProps<TData> {
  table: TanTable<TData>;
}

/**
 * View Options for a Data Table
 */
export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 lg:flex">
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DataTableFilterOptionsProps<TData> {
  table: TanTable<TData>;
  data: TData[];
}

/**
 * Filter Options for Data Table
 *
 * Uses column id as description in Dropdown => in column definition match header title and id of column
 */
export function DataTableFilterOptions<TData>({ table, data }: DataTableFilterOptionsProps<TData>) {
  const [sortingFor, setSortingFor] = useState<string>("");
  const [filterInput, setFilterInput] = useState<string>("");

  const columnsAccessKeys = table
    .getAllColumns()
    .filter((column) => {
      if (data.length === 0) return true;
      if (!column.accessorFn) return false;
      const sampleValue = column.accessorFn(data[0], 0);
      return typeof sampleValue === "string" || typeof sampleValue === "number";
    })
    .map((column) => {
      return column.id;
    });

  const saveSetSortingFor = useCallback(
    (key: string) => {
      if (columnsAccessKeys.includes(key)) {
        setSortingFor(key);
      }
    },
    [columnsAccessKeys]
  );

  useEffect(() => {
    if (columnsAccessKeys.length > 0) {
      setSortingFor(columnsAccessKeys[0]);
    }
  }, []);

  useEffect(() => {
    if (columnsAccessKeys.includes(sortingFor)) {
      table.getColumn(sortingFor)?.setFilterValue(filterInput);
    }
  }, [filterInput, sortingFor]);

  return (
    <div className="flex flex-row items-center justify-start gap-4">
      <Input
        placeholder="Filter ..."
        value={filterInput}
        onChange={(event) => setFilterInput(event.target.value)}
        className="max-w-sm"
      />
      <Select
        value={sortingFor}
        onValueChange={(value) => {
          table.getColumn(sortingFor)?.setFilterValue("");
          saveSetSortingFor(value);
        }}
      >
        <SelectTrigger className="w-min">
          <SelectValue placeholder="Select a Key" />
        </SelectTrigger>
        <SelectContent>
          {columnsAccessKeys.map((accessKey) => {
            return (
              <SelectItem key={accessKey} value={accessKey}>
                {accessKey}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
