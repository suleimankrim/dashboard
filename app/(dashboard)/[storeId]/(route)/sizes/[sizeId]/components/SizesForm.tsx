"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import Header from "@/components/ui/Header";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Size } from "@prisma/client";
import usePatchQuery from "@/hooks/query/use-patch-query";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import useDeleteQuery from "@/hooks/query/use-delete-query";
import usePostQuery from "@/hooks/query/use-post-query";

interface SizesFormProps {
  size: Size | null;
}

const SizesForm: FC<SizesFormProps> = ({ size }: SizesFormProps) => {
  const SizeSchema = z.object({
    name: z.string().min(2, {
      message: "label must be at least 2 characters.",
    }),
    value: z.string().min(1),
  });
  const form = useForm<z.infer<typeof SizeSchema>>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      name: size?.name || "",
      value: size?.value || "",
    },
  });
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: updateSize, isLoading: loadingUpdate } = usePatchQuery({
    query: `/api/${params.storeId}/sizes/${params.sizeId}`,
    onSuccessMessage: "Updated",
    onSuccessDescription: "size successfully updated",
  });
  const { mutate: createSize, isLoading: loadingCreate } = usePostQuery({
    query: `/api/${params.storeId}/sizes`,
    onSuccessMessage: "created",
    onSuccessDescription: "size successfully created",
  });
  const { mutate: deleteSize, isLoading: loadingDelete } = useDeleteQuery({
    query: `/api/${params.storeId}/sizes/${params.sizeId}`,
    onSuccessMessage: "size deleted",
    onErrorMessage: "ops...",
    onSuccessDescription: "size deleted successfully",
    onErrorDescription: "try again later",
  });
  async function onSubmit(values: z.infer<typeof SizeSchema>) {
    try {
      if (size) {
        updateSize(values);
      } else {
        createSize(values);
      }
      router.push(`/${params.storeId}/sizes`);
    } catch (e) {}
  }
  async function onDelete() {
    try {
      await deleteSize();
    } catch (e) {
    } finally {
      setOpen(false);
      router.push("/");
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
      <div className="flex justify-between items-center p-2">
        <Header
          title={size ? "Update size" : "Create size"}
          description={size ? "Update your size" : "Create a new size"}
        />
        {size && (
          <Button
            variant={"destructive"}
            onClick={() => setOpen(true)}
            size={"icon"}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <div className="max-w-[300px] p-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={!size ? "size name" : ""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="max-w-[300px] p-2">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder={!size ? "size value" : ""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-[293px] flex justify-end">
            <Button type="submit" variant={"default"} disabled={loadingUpdate}>
              {size ? "update" : "create"}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};
export default SizesForm;
