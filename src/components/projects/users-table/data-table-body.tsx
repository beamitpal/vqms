// src/components/projects/users-table/data-table-body.tsx
"use client";

import { Table as TanstackTable } from "@tanstack/react-table";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { User } from "@prisma/client";

interface DataTableBodyProps<TData = User> {
  table: TanstackTable<TData>;
}

export function DataTableBody<TData = User>({ table }: DataTableBodyProps<TData>) {
  return (
    <TableBody>
      {table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="text-xs"
                style={{ width: cell.column.getSize() }}
              >
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center text-xs">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}