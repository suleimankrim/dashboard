"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/[storeId]/(route)/colors/components/cell-action";

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex gap-1 items-center">
        {row.original.value}
        <div
          className="w-4 h-4 rounded-full"
          style={{ background: row.original.value }}
        ></div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original}></CellAction>,
  },
];
