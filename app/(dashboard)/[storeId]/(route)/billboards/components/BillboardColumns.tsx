"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "@/app/(dashboard)/[storeId]/(route)/billboards/components/cell-action";

export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
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
