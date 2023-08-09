import { db } from "@/lib/db";
import CategoryForm from "@/app/(dashboard)/[storeId]/(route)/categories/[categoryId]/components/CategoryForm";

interface PageProps {
  params: {
    storeId: string;
    categoryId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <>
      {" "}
      <CategoryForm category={category} billboards={billboards} />
    </>
  );
};
export default Page;
