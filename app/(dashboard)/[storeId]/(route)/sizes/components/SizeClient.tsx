"use client";
import { FC } from "react";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import {
  columns,
  SizeColumn,
} from "@/app/(dashboard)/[storeId]/(route)/sizes/components/SizeColumns";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient: FC<SizeClientProps> = ({ data }: SizeClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="w-full flex justify-between p-2">
        <Header
          title={`Size(${data.length})`}
          description={"menage Size for your store"}
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="w-4 h-4 mr-2" /> Add new size
        </Button>
      </div>
      <div className="px-2 w-full">
        <Separator />
      </div>
      <div className="p-2">
        <DataTable searchKey={"name"} data={data} columns={columns}></DataTable>
      </div>
    </>
  );
};
export default SizeClient;
