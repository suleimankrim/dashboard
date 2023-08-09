"use client";
import { FC } from "react";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  BillboardColumn,
  columns,
} from "@/app/(dashboard)/[storeId]/(route)/billboards/components/BillboardColumns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClient: FC<BillboardClientProps> = ({
  data,
}: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="w-full flex justify-between p-2">
        <Header
          title={`Billboard(${data.length})`}
          description={"menage product for your store"}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add new billboard
        </Button>
      </div>
      <div className="px-2 w-full">
        <Separator />
      </div>
      <div className="p-2">
        <DataTable
          searchKey={"label"}
          data={data}
          columns={columns}
        ></DataTable>
      </div>
    </>
  );
};
export default BillboardClient;
