"use client";

import { TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { User } from "@prisma/client";
import { DataTableHeaderProps } from "@/lib/types";

export function DataTableHeader<TData = User>({
  table,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="text-xs truncate px-2 py-1 sm:px-4 sm:py-2"
              style={{ maxWidth: `${header.getSize()}px` }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}