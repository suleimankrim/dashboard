"use client";
import { FC } from "react";
import Header from "@/components/ui/Header";
import AlertBox from "@/app/(dashboard)/[storeId]/(route)/settings/components/alert-box";
import { useParams } from "next/navigation";
import useOrigin from "@/hooks/use-origin";
import { Separator } from "@/components/ui/separator";

interface ApiListProps {
  entityName: string;
  entityId: string;
}

const ApiList: FC<ApiListProps> = ({ entityId, entityName }: ApiListProps) => {
  const params = useParams();
  const origin = useOrigin();
  const baseUrl = `${origin}/api/${params.storeId}/${entityName}`;
  return (
    <div className="p-2">
      <div className="py-1">
        <Header title="Api" description={`Api call for ${entityName}`} />
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col space-y-2">
        <AlertBox variant={"public"} title={"GET"} description={baseUrl} />
        <AlertBox
          variant={"public"}
          title={"GET"}
          description={`${baseUrl}/{${entityId}}`}
        />
        <AlertBox variant={"admin"} title={"POST"} description={`${baseUrl}`} />
        <AlertBox
          variant={"admin"}
          title={"PATCH"}
          description={`${baseUrl}/{${entityId}}`}
        />
        <AlertBox
          variant={"admin"}
          title={"DELETE"}
          description={`${baseUrl}/{${entityId}}`}
        />
      </div>
    </div>
  );
};
export default ApiList;
