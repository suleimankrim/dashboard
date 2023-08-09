"use client";
import { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import useDeleteQuery from "@/hooks/query/use-delete-query";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import { toast } from "@/hooks/use-toast";
import { SizeColumn } from "@/app/(dashboard)/[storeId]/(route)/sizes/components/SizeColumns";

interface CellActionProps {
  data: SizeColumn;
}

const CellAction: FC<CellActionProps> = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { mutate: deleteSize, isLoading: loadingDelete } = useDeleteQuery({
    query: `/api/${params.storeId}/sizes/${data.id}`,
    onSuccessMessage: "size deleted",
    onErrorMessage: "ops...",
    onSuccessDescription: "size deleted successfully",
    onErrorDescription:
      "make sure to delete all the product before delete the store",
  });
  function copyToClickBoard() {
    navigator.clipboard.writeText(data.id);
    return toast({
      title: "size id copied to the clipboard.",
    });
  }
  async function onDelete() {
    try {
      await deleteSize();
    } catch (e) {
    } finally {
      setOpen(false);
    }
  }
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        isLoading={loadingDelete}
        onConfirm={() => {
          onDelete();
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyToClickBoard}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-1" />
            delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
export default CellAction;
