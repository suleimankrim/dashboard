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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import usePatchQuery from "@/hooks/query/use-patch-query";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modal/alert-modal";
import useDeleteQuery from "@/hooks/query/use-delete-query";
import ImageUpload from "@/components/ImageUpload";
import usePostQuery from "@/hooks/query/use-post-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductSchema, ProductType } from "@/lib/validation";

interface ProductsFormProps {
  product:
    | (Product & {
        image: Image[];
      })
    | null;
  category: Category[];
  size: Size[];
  color: Color[];
}

const ProductsForm: FC<ProductsFormProps> = ({
  product,
  category,
  size,
  color,
}: ProductsFormProps) => {
  const form = useForm<ProductType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product?.name || "",
      image: product?.image || [],
      price: parseFloat(String(product?.price)) || 0,
      categoryId: product?.categoryId || "",
      colorId: product?.colorId || "",
      sizeId: product?.sizeId || "",
      isArchived: product?.isArchived || false,
      isFeatured: product?.isFeatured || false,
    },
  });
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: updateProduct, isLoading: loadingUpdate } = usePatchQuery({
    query: `/api/${params.storeId}/products/${params.productId}`,
    onSuccessMessage: "Updated",
    onSuccessDescription: "product successfully updated",
  });
  const { mutate: createProduct, isLoading: loadingCreate } = usePostQuery({
    query: `/api/${params.storeId}/products`,
    onSuccessMessage: "created",
    onSuccessDescription: "product successfully created",
  });
  const { mutate: deleteProduct, isLoading: loadingDelete } = useDeleteQuery({
    query: `/api/${params.storeId}/products/${params.productId}`,
    onSuccessMessage: "product deleted",
    onErrorMessage: "ops...",
    onSuccessDescription: "product deleted successfully",
    onErrorDescription: "try again later",
  });
  async function onSubmit(values: z.infer<typeof ProductSchema>) {
    try {
      if (product) {
        updateProduct(values);
      } else {
        createProduct(values);
      }
      router.push(`/${params.storeId}/products`);
    } catch (e) {}
  }
  async function onDelete() {
    try {
      await deleteProduct();
    } catch (e) {
    } finally {
      setOpen(false);
      router.push("/");
    }
  }
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
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
          title={product ? "Update product" : "Create product"}
          description={product ? "Update your product" : "Create a new product"}
        />
        {product && (
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-1">
            <div className="max-w-[300px] p-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={!product ? "product Name" : ""}
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={!product ? "product Name" : ""}
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {category.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
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
                name="sizeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {size.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
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
                name="colorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a color"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {color.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
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
            <div className="max-w-[300px] border rounded-md p-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormControl>
                        <Checkbox
                          className="mt-2"
                          onCheckedChange={field.onChange}
                          //@ts-ignore
                          value={field.value}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          This product will appear on the Home Page
                        </FormDescription>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="max-w-[300px] border p-2 rounded-md">
              <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormControl>
                        <Checkbox
                          className="mt-2"
                          onCheckedChange={field.onChange}
                          //@ts-ignore
                          value={field.value}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>Archived</FormLabel>
                        <FormDescription>
                          This product will not appear anywhere on the store
                        </FormDescription>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-[293px] flex justify-end mt-2">
            <Button type="submit" variant={"default"} disabled={loadingUpdate}>
              {product ? "update" : "create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
export default ProductsForm;
