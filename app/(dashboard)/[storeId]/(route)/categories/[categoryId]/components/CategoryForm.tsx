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
import { Billboard, Category } from "@prisma/client";
import usePatchQuery from "@/hooks/query/use-patch-query";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import useDeleteQuery from "@/hooks/query/use-delete-query";
import usePostQuery from "@/hooks/query/use-post-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  category: Category | null;
  billboards: Billboard[];
}

const CategoryForm: FC<CategoryFormProps> = ({
  category,
  billboards,
}: CategoryFormProps) => {
  const CategorySchema = z.object({
    name: z.string().min(2, {
      message: "label must be at least 2 characters.",
    }),
    billboardId: z.string().min(2),
  });
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category?.name || "",
      billboardId: category?.billboardId || "",
    },
  });
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: updateCategory, isLoading: loadingUpdate } = usePatchQuery({
    query: `/api/${params.storeId}/categories/${params.categoryId}`,
    onSuccessMessage: "Updated",
    onSuccessDescription: "category successfully updated",
  });
  const { mutate: createCategory, isLoading: loadingCreate } = usePostQuery({
    query: `/api/${params.storeId}/categories`,
    onSuccessMessage: "created",
    onSuccessDescription: "category successfully created",
  });
  const { mutate: deleteCategory, isLoading: loadingDelete } = useDeleteQuery({
    query: `/api/${params.storeId}/categories/${params.categoryId}`,
    onSuccessMessage: "category deleted",
    onErrorMessage: "ops...",
    onSuccessDescription: "category deleted successfully",
    onErrorDescription: "try again later",
  });
  async function onSubmit(values: z.infer<typeof CategorySchema>) {
    try {
      if (category) {
        updateCategory(values);
      } else {
        createCategory(values);
      }
      router.push(`/${params.storeId}/categories`);
    } catch (e) {}
  }
  async function onDeleteCategory() {
    try {
      await deleteCategory();
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
          onDeleteCategory();
        }}
      />
      <div className="flex justify-between items-center p-2">
        <Header
          title={category ? "Update Category" : "Create Category"}
          description={
            category ? "Update your Category" : "Create a new Category"
          }
        />
        {category && (
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="max-w-[300px] p-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={!category ? "category label" : ""}
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
              {category ? "update" : "create"}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
    </>
  );
};
export default CategoryForm;
