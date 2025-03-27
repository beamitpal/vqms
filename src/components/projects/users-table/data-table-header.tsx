// src/components/projects/users-table/data-table-header.tsx
"use client";

import { Table as TanstackTable } from "@tanstack/react-table";
import { TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { User } from "@prisma/client";

interface DataTableHeaderProps<TData = User> {
  table: TanstackTable<TData>;
}

export function DataTableHeader<TData = User>({ table }: DataTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              className="text-xs truncate"
              style={{ width: header.getSize() }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}