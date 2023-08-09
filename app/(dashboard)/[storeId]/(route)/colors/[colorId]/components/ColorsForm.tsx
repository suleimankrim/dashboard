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
import { Color } from "@prisma/client";
import usePatchQuery from "@/hooks/query/use-patch-query";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import useDeleteQuery from "@/hooks/query/use-delete-query";
import usePostQuery from "@/hooks/query/use-post-query";

interface ColorsFormProps {
  color: Color | null;
}

const ColorsForm: FC<ColorsFormProps> = ({ color }: ColorsFormProps) => {
  const ColorSchema = z.object({
    name: z.string().min(2, {
      message: "label must be at least 2 characters.",
    }),
    value: z.string().min(4).regex(/^#/, { message: "value should be in hex" }),
  });
  const form = useForm<z.infer<typeof ColorSchema>>({
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      name: color?.name || "",
      value: color?.value || "",
    },
  });
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: updateColor, isLoading: loadingUpdate } = usePatchQuery({
    query: `/api/${params.storeId}/colors/${params.colorId}`,
    onSuccessMessage: "Updated",
    onSuccessDescription: "color successfully updated",
  });
  const { mutate: createColor, isLoading: loadingCreate } = usePostQuery({
    query: `/api/${params.storeId}/colors`,
    onSuccessMessage: "created",
    onSuccessDescription: "color successfully created",
  });
  const { mutate: deleteColor, isLoading: loadingDelete } = useDeleteQuery({
    query: `/api/${params.storeId}/colors/${params.colorId}`,
    onSuccessMessage: "color deleted",
    onErrorMessage: "ops...",
    onSuccessDescription: "color deleted successfully",
    onErrorDescription: "try again later",
  });
  async function onSubmit(values: z.infer<typeof ColorSchema>) {
    try {
      if (color) {
        updateColor(values);
      } else {
        createColor(values);
      }
      router.push(`/${params.storeId}/colors`);
    } catch (e) {}
  }
  async function onDelete() {
    try {
      await deleteColor();
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
          title={color ? "Update color" : "Create color"}
          description={color ? "Update your color" : "Create a new color"}
        />
        {color && (
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
                    <Input
                      placeholder={!color ? "color name" : ""}
                      {...field}
                    />
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
                    <Input
                      placeholder={!color ? "color value" : ""}
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
              {color ? "update" : "create"}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};
export default ColorsForm;
