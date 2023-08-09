"use client";
import { FC } from "react";
import Header from "@/components/ui/Header";
import {
  columns,
  OrderColumn,
} from "@/app/(dashboard)/[storeId]/(route)/orders/components/OrdersColumns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrdersClient: FC<OrderClientProps> = ({ data }: OrderClientProps) => {
  return (
    <>
      <div className="w-full flex justify-between p-2">
        <Header
          title={`Order(${data.length})`}
          description={"menage product for your Order"}
        />
      </div>
      <div className="px-2 w-full">
        <Separator />
      </div>
      <div className="p-2">
        <DataTable
          searchKey={"product"}
          data={data}
          columns={columns}
        ></DataTable>
      </div>
    </>
  );
};
export default OrdersClient;
