import { format } from "date-fns";
import { FC } from "react";
import { db } from "@/lib/db";
import ApiList from "@/app/(dashboard)/[storeId]/(route)/billboards/components/ApiList";
import { Separator } from "@/components/ui/separator";
import ColorClient from "@/app/(dashboard)/[storeId]/(route)/colors/components/ColorClient";
import { ColorColumn } from "@/app/(dashboard)/[storeId]/(route)/colors/components/ColorColumns";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page: FC<PageProps> = async ({ params }: PageProps) => {
  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatToColor: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <>
      <ColorClient data={formatToColor} />
      <div className="px-2">
        <Separator />
      </div>
      <ApiList entityName={"color"} entityId={"colorId"} />
    </>
  );
};
export default Page;
