import { db } from "@/lib/db";
import SizesForm from "@/app/(dashboard)/[storeId]/(route)/sizes/[sizeId]/components/SizesForm";

interface PageProps {
  params: {
    sizeId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const size = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <>
      {" "}
      <SizesForm size={size} />
    </>
  );
};
export default Page;
