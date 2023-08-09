import { db } from "@/lib/db";
import BillboardsForm from "@/app/(dashboard)/[storeId]/(route)/billboards/[billboardId]/components/BillboardsForm";

interface PageProps {
  params: {
    billboardId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <>
      {" "}
      <BillboardsForm billboard={billboard} />
    </>
  );
};
export default Page;
