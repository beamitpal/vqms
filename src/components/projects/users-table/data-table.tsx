"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { Table } from "@/components/ui/table";
import { DataTableHeader } from "./data-table-header";
import { DataTableBody } from "./data-table-body";
import { DataTablePagination } from "./data-table-pagination";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { DataTableProps } from "@/lib/types";

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
    <div
      className={cn(
        "space-y-4 w-full max-w-full overflow-x-auto sm:overflow-x-hidden",
        className
      )}
    >
      {(filterKey || filterOptions) && (
        <DataTableToolbar
          table={table}
          filterKey={filterKey}
          filterOptions={filterOptions}
        />
      )}
      <div className="rounded-md border w-full max-w-full overflow-x-auto sm:overflow-x-hidden">
        <Table className="w-full min-w-[300px] table-auto">
          <DataTableHeader table={table} />
          <DataTableBody table={table} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}