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
import { Store } from "@prisma/client";
import usePatchQuery from "@/hooks/query/use-patch-query";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import useDeleteQuery from "@/hooks/query/use-delete-query";
import AlertBox from "@/app/(dashboard)/[storeId]/(route)/settings/components/alert-box";
import useOrigin from "@/hooks/use-origin";

interface SettingFormProps {
  store: Store;
}

const SettingForm: FC<SettingFormProps> = ({ store }: SettingFormProps) => {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name,
    },
  });
  const origin = useOrigin();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: changeStoreName, isLoading: loadingUpdate } = usePatchQuery({
    query: `/api/store/${params.storeId}`,
    onSuccessMessage: "Updated",
    onSuccessDescription: "store name successfully updated",
  });
  const { mutate: deleteStore, isLoading: loadingDelete } = useDeleteQuery({
    query: `/api/store/${params.storeId}`,
    onSuccessMessage: "store deleted",
    onErrorMessage: "ops...",
    onSuccessDescription: "store deleted successfully",
    onErrorDescription:
      "make sure to delete all the product before delete the store",
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await changeStoreName({ name: values.name });
    } catch (e) {}
  }
  async function onDelete() {
    try {
      await deleteStore();
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
          title="Wellcome To Settings"
          description={"customize you store"}
        />
        <Button
          variant={"destructive"}
          onClick={() => setOpen(true)}
          size={"icon"}
        >
          <Trash className="w-4 h-4" />
        </Button>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-[293px] flex justify-end">
            <Button type="submit" variant={"default"} disabled={loadingUpdate}>
              Change
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
      <AlertBox
        variant={"public"}
        title={"NEXT_PUBLIC_URL"}
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};
export default SettingForm;
