"use client";
import { FC } from "react";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import {
  CategoryColumn,
  columns,
} from "@/app/(dashboard)/[storeId]/(route)/categories/components/CategoryColumns";

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient: FC<CategoryClientProps> = ({
  data,
}: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="w-full flex justify-between p-2">
        <Header
          title={`Category(${data.length})`}
          description={"menage category for your store"}
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add new category
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
export default CategoryClient;
