import { format } from "date-fns";
import { FC } from "react";
import { db } from "@/lib/db";
import ApiList from "@/app/(dashboard)/[storeId]/(route)/billboards/components/ApiList";
import { Separator } from "@/components/ui/separator";
import { CategoryColumn } from "@/app/(dashboard)/[storeId]/(route)/categories/components/CategoryColumns";
import CategoryClient from "@/app/(dashboard)/[storeId]/(route)/categories/components/CategoryClient";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page: FC<PageProps> = async ({ params }: PageProps) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      Billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatToBillboard: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.Billboard.label,
    createdAt: format(item.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <>
      <CategoryClient data={formatToBillboard} />
      <div className="px-2">
        <Separator />
      </div>
      <ApiList entityName={"category"} entityId={"categoryId"} />
    </>
  );
};
export default Page;
