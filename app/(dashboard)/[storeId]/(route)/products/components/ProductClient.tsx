"use client";
import { FC } from "react";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  columns,
  ProductColumn,
} from "@/app/(dashboard)/[storeId]/(route)/products/components/ProductColumns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient: FC<ProductClientProps> = ({
  data,
}: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="w-full flex justify-between p-2">
        <Header
          title={`Product(${data.length})`}
          description={"menage product for your store"}
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="w-4 h-4 mr-2" /> Add new product
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
export default ProductClient;
