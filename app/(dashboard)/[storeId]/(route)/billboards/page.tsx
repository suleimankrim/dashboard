import { format } from "date-fns";
import { FC } from "react";
import BillboardClient from "@/app/(dashboard)/[storeId]/(route)/billboards/components/BillboardClient";
import { db } from "@/lib/db";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(route)/billboards/components/BillboardColumns";
import ApiList from "@/app/(dashboard)/[storeId]/(route)/billboards/components/ApiList";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page: FC<PageProps> = async ({ params }: PageProps) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatToBillboard: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <>
      <BillboardClient data={formatToBillboard} />
      <div className="px-2">
        <Separator />
      </div>
      <ApiList entityName={"billboard"} entityId={"billboardId"} />
    </>
  );
};
export default Page;
