
"use client";


import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { User } from "@prisma/client";
import { DataTableToolbarProps } from "@/lib/types";



export function DataTableToolbar<TData = User>({
  table,
  filterKey,
  filterOptions,
}: DataTableToolbarProps<TData>) {
  const filterColumn = filterKey ? table.getColumn(filterKey) : undefined;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterKey && filterColumn && (
          <Input
            placeholder={`Filter ${filterKey}...`}
            value={(filterColumn.getFilterValue() as string) ?? ""}
            onChange={(event) => filterColumn.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filterOptions && filterColumn && (
          <DataTableFacetedFilter
            column={filterColumn}
            title={filterKey}
            options={filterOptions}
          />
        )}
      </div>
    </div>
  );
}