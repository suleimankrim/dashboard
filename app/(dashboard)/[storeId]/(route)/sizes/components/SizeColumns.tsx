"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/[storeId]/(route)/sizes/components/cell-action";

export type SizeColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAT",
  },
  {
    id: "action",
    cell: ({ row }) => <CellAction data={row.original}></CellAction>,
  },
];
