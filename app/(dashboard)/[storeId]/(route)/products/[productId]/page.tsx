import { db } from "@/lib/db";
import ProductsForm from "@/app/(dashboard)/[storeId]/(route)/products/[productId]/components/ProductsForm";

interface PageProps {
  params: {
    storeId: string;
    productId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      image: true,
    },
  });
  const category = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const color = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const size = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <>
      {" "}
      <ProductsForm
        color={color}
        size={size}
        category={category}
        product={product}
      />
    </>
  );
};
export default Page;
