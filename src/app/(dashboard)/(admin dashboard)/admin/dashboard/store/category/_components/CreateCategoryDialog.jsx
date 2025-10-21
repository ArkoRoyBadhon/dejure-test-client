"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
} from "@/redux/features/Products/ProductCategory.api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  image: z.any(),
});

export function CreateCategoryDialog({ category, children }) {
  const [open, setOpen] = useState(false);
  const [createCategory, { isLoading: isCreating }] =
    useCreateProductCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateProductCategoryMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: category?.title || "",
      image: null,
    },
  });

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    if (values.image) {
      formData.append("image", values.image);
    }

    try {
      if (category) {
        // Update existing category
        await updateCategory({ id: category._id, data: formData }).unwrap();
        toast("Category updated successfully");
      } else {
        // Create new category
        await createCategory(formData).unwrap();
        toast("Category created successfully");
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      toast(error?.data?.message || "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline">Create Category</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Category title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {category?.image && (
              <div className="flex justify-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${category.image}`}
                  alt={category.title}
                  className="h-20 w-20 object-contain"
                />
              </div>
            )}
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : category ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
