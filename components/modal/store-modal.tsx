"use client";
import { FC } from "react";
import { useModelStore } from "@/hooks/use-store-modal";
import Modal from "@/components/ui/modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import usePostQuery from "@/hooks/query/use-post-query";
import { useRouter } from "next/navigation";

const StoreModal: FC = () => {
  const store = useModelStore();
  const formSchema = z.object({
    name: z.string().min(2).max(50),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const { mutate, isLoading } = usePostQuery({
    query: "/api/store",
    onSuccessMessage: "E-commerce successfully created",
    onSuccessDescription: "explore a new (dashboard) for your E-commerce",
    onErrorDescription: "please provide new unique name",
    onErrorMessage: "already existing name",
  });
  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await mutate({ name: values.name });
      await store.onClose();
    } catch (e) {}
    await router.refresh();
  }
  return (
    <Modal
      isOpen={store.isOpen}
      title={"Create Store"}
      description={"Add a new store to manage product and categories"}
      onClose={store.onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="E-Commerce"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full justify-end flex">
            <Button
              className="mr-2"
              variant={"secondary"}
              type={"button"}
              disabled={isLoading}
              onClick={store.onClose}
            >
              Close
            </Button>

            <Button type="submit" disabled={isLoading}>
              Create Store
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
export default StoreModal;
