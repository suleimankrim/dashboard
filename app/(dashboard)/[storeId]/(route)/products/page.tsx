import { format } from "date-fns";
import { FC } from "react";
import { db } from "@/lib/db";
import ApiList from "@/app/(dashboard)/[storeId]/(route)/billboards/components/ApiList";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { ProductColumn } from "@/app/(dashboard)/[storeId]/(route)/products/components/ProductColumns";
import ProductClient from "@/app/(dashboard)/[storeId]/(route)/products/components/ProductClient";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page: FC<PageProps> = async ({ params }: PageProps) => {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      Color: true,
      Size: true,
      Category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatToProduct: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.Category.name,
    size: item.Size.name,
    color: item.Color.name,
    createdAt: format(item.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <>
      <ProductClient data={formatToProduct} />
      <div className="px-2">
        <Separator />
      </div>
      <ApiList entityName={"product"} entityId={"productId"} />
    </>
  );
};
export default Page;
