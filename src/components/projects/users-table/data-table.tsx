// src/components/projects/users-table/data-table.tsx
"use client";

import { ColumnDef, useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { Table } from "@/components/ui/table";
import { DataTableHeader } from "./data-table-header";
import { DataTableBody } from "./data-table-body";
import { DataTablePagination } from "./data-table-pagination";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

interface DataTableProps<TData = User, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  filterOptions?: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[];
  className?: string;
}

export function DataTable<TData = User, TValue = unknown>({
  columns,
  data,
  filterKey,
  filterOptions,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    columnResizeMode: "onChange",
  });

  return (
    <div className={cn("space-y-4 w-full max-w-full overflow-hidden", className)}>
      {(filterKey || filterOptions) && (
        <DataTableToolbar
          table={table}
          filterKey={filterKey}
          filterOptions={filterOptions}
        />
      )}
      <div className="rounded-md border w-full max-w-full overflow-hidden">
        <Table className="w-full table-auto min-w-0">
          <DataTableHeader table={table} />
          <DataTableBody table={table} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}