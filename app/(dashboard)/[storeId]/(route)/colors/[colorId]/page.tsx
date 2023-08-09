import { db } from "@/lib/db";
import ColorsForm from "@/app/(dashboard)/[storeId]/(route)/colors/[colorId]/components/ColorsForm";

interface PageProps {
  params: {
    colorId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const color = await db.color.findUnique({
    where: {
      id: params.colorId,
    },
  });
  return (
    <>
      {" "}
      <ColorsForm color={color} />
    </>
  );
};
export default Page;
