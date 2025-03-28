"use client";

import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { User } from "@prisma/client";
import { DataTableBodyProps } from "@/lib/types";

export function DataTableBody<TData = User>({
  table,
}: DataTableBodyProps<TData>) {
  return (
    <TableBody>
      {table.getRowModel().rows.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="text-xs truncate px-2 py-1 sm:px-4 sm:py-2"
                style={{ maxWidth: `${cell.column.getSize()}px` }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center text-xs"
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}