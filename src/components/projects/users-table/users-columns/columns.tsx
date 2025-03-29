"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "../data-table-row-actions";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { CustomField, UserColumnsProps } from "@/lib/types";

const baseStaticColumns: ColumnDef<User>[] = [
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
    size: 40, 
  },
];

const statusColumn: ColumnDef<User> = {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => (
    <div className="min-w-[50px] max-w-[80px] truncate text-xs">
      <span
        className={cn(
          "capitalize",
          row.getValue("status") === "ACTIVE"
            ? "text-green-500"
            : "text-red-500"
        )}
      >
        {row.getValue("status")}
      </span>
    </div>
  ),
  filterFn: (row, id, value) => value.includes(row.getValue(id)),
  size: 80,
};

const createdAtColumn: ColumnDef<User> = {
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
};

const staticDataColumns: ColumnDef<User>[] = [
  {
    accessorKey: "data.name",
    header: "Name",
    cell: ({ row }) => {
      const data = row.original.data as Record<string, string>;
      const value = data?.name || "N/A";
      return (
        <div className="min-w-[70px] max-w-[120px] truncate text-xs">
          {value}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const data = row.original.data as Record<string, string>;
      const cellValue = data?.name || "";
      return value
        ? cellValue.toLowerCase().includes(value.toLowerCase())
        : true;
    },
    size: 120,
    enableSorting: true,
  },
  {
    accessorKey: "data.email",
    header: "Email",
    cell: ({ row }) => {
      const data = row.original.data as Record<string, string>;
      const value = data?.email || "N/A";
      return (
        <div className="min-w-[100px] max-w-[150px] truncate text-xs">
          {value}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const data = row.original.data as Record<string, string>;
      const cellValue = data?.email || "";
      return value
        ? cellValue.toLowerCase().includes(value.toLowerCase())
        : true;
    },
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "data.address",
    header: "Address",
    cell: ({ row }) => {
      const data = row.original.data as Record<string, string>;
      const value = data?.address || "N/A";
      return (
        <div className="min-w-[100px] max-w-[150px] truncate text-xs">
          {value}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const data = row.original.data as Record<string, string>;
      const cellValue = data?.address || "";
      return value
        ? cellValue.toLowerCase().includes(value.toLowerCase())
        : true;
    },
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "data.phoneNumber",
    header: "Phone Number",
    cell: ({ row }) => {
      const data = row.original.data as Record<string, string>;
      const value = data?.phoneNumber || "N/A";
      return (
        <div className="min-w-[80px] max-w-[120px] truncate text-xs">
          {value}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const data = row.original.data as Record<string, string>;
      const cellValue = data?.phoneNumber || "";
      return value
        ? cellValue.toLowerCase().includes(value.toLowerCase())
        : true;
    },
    size: 120,
    enableSorting: true,
  },
  {
    accessorKey: "data.notes",
    header: "Notes",
    cell: ({ row }) => {
      const data = row.original.data as Record<string, string>;
      const value = data?.notes || "N/A";
      return (
        <div className="min-w-[100px] max-w-[150px] truncate text-xs">
          {value}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const data = row.original.data as Record<string, string>;
      const cellValue = data?.notes || "";
      return value
        ? cellValue.toLowerCase().includes(value.toLowerCase())
        : true;
    },
    size: 150,
    enableSorting: true,
  },
];

const actionsColumn: ColumnDef<User> = {
  id: "actions",
  cell: ({ row }) => <DataTableRowActions row={row} />,
  size: 40, // Slightly increased for visibility
};

const generateDynamicColumns = (
  customFields: Record<string, CustomField> = {}
): ColumnDef<User>[] => {
  return Object.entries(customFields).map(([fieldName]) => ({
    accessorKey: `data.${fieldName}`,
    header: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
    cell: ({ row }) => {
      const data = row.original.data as Record<string, string>;
      const value = data?.[fieldName] || "N/A";
      return (
        <div className="min-w-[70px] max-w-[120px] truncate text-xs">
          {value}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const data = row.original.data as Record<string, string>;
      const cellValue = data?.[fieldName] || "";
      return value
        ? cellValue.toLowerCase().includes(value.toLowerCase())
        : true;
    },
    size: 120,
    enableSorting: true,
  }));
};

export const userColumns = (
  props: UserColumnsProps = {}
): ColumnDef<User>[] => {
  const { customFields } = props;
  const dynamicColumns = generateDynamicColumns(customFields);
  return [
    ...baseStaticColumns,
    ...staticDataColumns,
    statusColumn,
    ...dynamicColumns,
    createdAtColumn,
    actionsColumn,
  ];
};

export const userFilterOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];