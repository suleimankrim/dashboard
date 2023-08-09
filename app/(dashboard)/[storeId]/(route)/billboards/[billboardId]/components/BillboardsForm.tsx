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
import { Billboard } from "@prisma/client";
import usePatchQuery from "@/hooks/query/use-patch-query";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import useDeleteQuery from "@/hooks/query/use-delete-query";
import ImageUpload from "@/components/ImageUpload";
import usePostQuery from "@/hooks/query/use-post-query";

interface BillboardsFormProps {
  billboard: Billboard | null;
}

const BillboardsForm: FC<BillboardsFormProps> = ({
  billboard,
}: BillboardsFormProps) => {
  const BillboardSchema = z.object({
    label: z.string().min(2, {
      message: "label must be at least 2 characters.",
    }),
    imageUrl: z.string().min(2),
  });
  const form = useForm<z.infer<typeof BillboardSchema>>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: {
      label: billboard?.label || "",
      imageUrl: billboard?.imageUrl || "",
    },
  });
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: updateBillboard, isLoading: loadingUpdate } = usePatchQuery({
    query: `/api/${params.storeId}/billboard/${params.billboardId}`,
    onSuccessMessage: "Updated",
    onSuccessDescription: "product successfully updated",
  });
  const { mutate: createBillboard, isLoading: loadingCreate } = usePostQuery({
    query: `/api/${params.storeId}/billboard`,
    onSuccessMessage: "created",
    onSuccessDescription: "product successfully created",
  });
  const { mutate: deleteBillboard, isLoading: loadingDelete } = useDeleteQuery({
    query: `/api/${params.storeId}/billboard/${params.billboardId}`,
    onSuccessMessage: "product deleted",
    onErrorMessage: "ops...",
    onSuccessDescription: "product deleted successfully",
    onErrorDescription: "try again later",
  });
  async function onSubmit(values: z.infer<typeof BillboardSchema>) {
    try {
      if (billboard) {
        updateBillboard(values);
      } else {
        createBillboard(values);
      }
      router.push(`/${params.storeId}/billboards`);
    } catch (e) {}
  }
  async function onDelete() {
    try {
      await deleteBillboard();
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
          title={billboard ? "Update Billboard" : "Create Billboard"}
          description={
            billboard ? "Update your Billboard" : "Create a new Billboard"
          }
        />
        {billboard && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onRemove={() => field.onChange("")}
                    onChange={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="max-w-[300px] p-2">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={!billboard ? "product label" : ""}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-[293px] flex justify-end">
            <Button type="submit" variant={"default"} disabled={loadingUpdate}>
              {billboard ? "update" : "create"}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};
export default BillboardsForm;
