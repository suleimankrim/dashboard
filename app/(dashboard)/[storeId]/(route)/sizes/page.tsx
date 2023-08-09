import { format } from "date-fns";
import { FC } from "react";
import { db } from "@/lib/db";
import ApiList from "@/app/(dashboard)/[storeId]/(route)/billboards/components/ApiList";
import { Separator } from "@/components/ui/separator";
import { SizeColumn } from "@/app/(dashboard)/[storeId]/(route)/sizes/components/SizeColumns";
import SizeClient from "@/app/(dashboard)/[storeId]/(route)/sizes/components/SizeClient";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page: FC<PageProps> = async ({ params }: PageProps) => {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatToSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <>
      <SizeClient data={formatToSizes} />
      <div className="px-2">
        <Separator />
      </div>
      <ApiList entityName={"size"} entityId={"sizeId"} />
    </>
  );
};
export default Page;
