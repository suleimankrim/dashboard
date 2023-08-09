import { format } from "date-fns";
import { FC } from "react";
import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "@/app/(dashboard)/[storeId]/(route)/orders/components/OrdersColumns";
import OrdersClient from "@/app/(dashboard)/[storeId]/(route)/orders/components/OrdersClient";

interface PageProps {
  params: {
    storeId: string;
  };
}

const Page: FC<PageProps> = async ({ params }: PageProps) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItem: {
        include: {
          Product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatToOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    product: item.orderItem.map((item) => item.Product.name).join(","),
    totalPrice: formatter.format(
      item.orderItem.reduce((total, item) => {
        return total + Number(item.Product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    address: item.address,
    phone: item.phone,
    createdAt: format(item.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <>
      <OrdersClient data={formatToOrders} />
    </>
  );
};
export default Page;
