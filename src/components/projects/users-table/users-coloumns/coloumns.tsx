// src/components/projects/users-table/users-coloumns/coloumns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "../data-table-row-actions";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30, // Smaller width for checkbox
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <div className="min-w-[50px] max-w-[100px] truncate capitalize text-xs">
        {row.getValue("username")}
      </div>
    ),
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="min-w-[70px] max-w-[120px] truncate text-xs">
        {row.getValue("email")}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="min-w-[50px] max-w-[80px] truncate capitalize text-xs">
        {row.getValue("role")}
      </div>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    size: 80,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[50px] max-w-[80px] truncate text-xs">
        <span
          className={cn(
            "capitalize",
            row.getValue("status") === "active" ? "text-green-500" : "text-red-500"
          )}
        >
          {row.getValue("status")}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    size: 80,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return (
        <div className="min-w-[70px] max-w-[90px] truncate text-xs">
          {formattedDate}
        </div>
      );
    },
    size: 90,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 30, // Smaller width for actions
  },
];

export const userFilterOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];