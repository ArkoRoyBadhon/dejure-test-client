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
import { useState, useMemo, useEffect } from "react";
import { Loader2, FileText, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/redux/features/Products/Products.api";
import { useGetAllproductCategoriesQuery } from "@/redux/features/Products/ProductCategory.api";
import { toast } from "sonner";

const paymentMethods = [
  "cod",
  "bkash",
  "nagad",
  "rocket",
  "visa",
  "mastercard",
];

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters",
  }),
  author: z.string().min(2, {
    message: "Author name must be at least 2 characters",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  price: z.number().min(0, {
    message: "Price must be positive",
  }),
  oldPrice: z
    .number()
    .min(0, {
      message: "Old price must be positive",
    })
    .optional(),
  image: z
    .any()
    .refine((file) => file instanceof File || typeof file === "string", {
      message: "Image is required",
    })
    .refine(
      (file) =>
        !(file instanceof File) ||
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only .jpg, .jpeg, .png and .webp formats are supported",
      }
    )
    .refine((file) => !(file instanceof File) || file.size <= 5_000_000, {
      message: "Max file size is 5MB",
    }),
  PreviewPages: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        file instanceof File ||
        typeof file === "string" ||
        file === null,
      {
        message: "Preview pages must be a file or string",
      }
    )
    .refine(
      (file) =>
        !(file instanceof File) || ["application/pdf"].includes(file.type),
      {
        message: "Only PDF format is supported for preview pages",
      }
    ),
  type: z.enum(["pdf", "print"]).optional(),
  isFree: z.boolean().default(false),
  size: z.array(z.string()).optional(),
  stock: z.number().min(0, {
    message: "Stock must be positive",
  }),
  availablePaymentMethods: z.array(z.enum(paymentMethods)),
  totalRatings: z.number().min(0).optional(),
  totalReviews: z.number().min(0).optional(),
  starCount: z.number().min(0).optional(),
});

export function CreateProductDialog({ product, children }) {
  const [open, setOpen] = useState(false);
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categories } = useGetAllproductCategoriesQuery();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      oldPrice: undefined,
      image: null,
      PreviewPages: null,
      type: undefined,
      isFree: false,
      size: [],
      stock: 0,
      author: "",
      availablePaymentMethods: [],
      totalRatings: 0,
      totalReviews: 0,
      starCount: 0,
    },
  });

  useEffect(() => {
    if (open && product) {
      form.reset({
        title: product.title || "",
        description: product.description || "",
        category: product.category?._id || "",
        price: product.price ? Number(product.price) : 0,
        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
        image: product.image || null,
        PreviewPages: product.PreviewPages || null,
        type: product.type || undefined,
        isFree: product.isFree || false,
        size: product.size || [],
        author: product.author || "",
        stock: product.stock ? Number(product.stock) : 0,
        availablePaymentMethods: product.availablePaymentMethods || [],
        totalRatings: product.totalRatings ? Number(product.totalRatings) : 0,
        totalReviews: product.totalReviews ? Number(product.totalReviews) : 0,
        starCount: product.starCount ? Number(product.starCount) : 0,
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, product, form]);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const selectedImage = form.watch("image");
  const selectedPreviewPages = form.watch("PreviewPages");

  const imagePreview = useMemo(() => {
    if (!selectedImage) return null;
    if (typeof selectedImage === "string") {
      return `${process.env.NEXT_PUBLIC_API_URL}/${selectedImage}`;
    }
    if (selectedImage instanceof File) {
      return URL.createObjectURL(selectedImage);
    }
    return null;
  }, [selectedImage]);

  const previewPagesUrl = useMemo(() => {
    if (!selectedPreviewPages) return null;
    if (typeof selectedPreviewPages === "string") {
      return `${process.env.NEXT_PUBLIC_API_URL}/${selectedPreviewPages}`;
    }
    if (selectedPreviewPages instanceof File) {
      return URL.createObjectURL(selectedPreviewPages);
    }
    return null;
  }, [selectedPreviewPages]);

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("price", values.price.toString());

    if (values.oldPrice) {
      formData.append("oldPrice", values.oldPrice.toString());
    }

    if (values.image instanceof File) {
      formData.append("image", values.image);
    } else if (product?.image && !values.image) {
      formData.append("image", product.image);
    }
    formData.append("author", values.author);

    // Replace your current PreviewPages handling with this:
    if (values.PreviewPages instanceof File) {
      formData.append("file", values.PreviewPages); // Changed from "PreviewPages" to "file"
    } else if (
      product?.PreviewPages &&
      typeof values.PreviewPages === "string"
    ) {
      // Keep existing preview pages path
      formData.append("PreviewPages", values.PreviewPages);
    } else if (product?.PreviewPages && values.PreviewPages === null) {
      formData.append("removePreviewPages", "true");
    }

    if (values.type) {
      formData.append("type", values.type);
    }

    formData.append("isFree", values.isFree.toString());

    if (values.size && values.size.length > 0) {
      values.size.forEach((size) => formData.append("size", size));
    }

    formData.append("stock", values.stock.toString());

    values.availablePaymentMethods.forEach((method) => {
      formData.append("availablePaymentMethods", method);
    });

    if (values.totalRatings !== undefined) {
      formData.append("totalRatings", values.totalRatings.toString());
    }
    if (values.totalReviews !== undefined) {
      formData.append("totalReviews", values.totalReviews.toString());
    }
    if (values.starCount !== undefined) {
      formData.append("starCount", values.starCount.toString());
    }

    try {
      if (product) {
        await updateProduct({ id: product._id, data: formData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Product created successfully");
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="bg-yellow-50 border-yellow-500">
            Create Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto custom-dialog-width">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author*</FormLabel>
                  <FormControl>
                    <Input placeholder="Product author" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="oldPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? undefined : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="totalRatings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Ratings</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalReviews"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Reviews</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="starCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Star Count (5 max)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0 (5 max)"
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{product ? "Change Image" : "Image*"}</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                        }}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {imagePreview && (
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-20 w-20 object-contain border rounded-md"
                  />
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="PreviewPages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preview Pages (PDF)</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0]);
                        }}
                        className="cursor-pointer mb-2"
                      />
                      {previewPagesUrl && (
                        <div className="flex items-center gap-2 mt-2 p-2 border rounded-md">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="text-sm text-gray-600 flex-1 truncate">
                            {typeof selectedPreviewPages === "string"
                              ? selectedPreviewPages.split("/").pop()
                              : selectedPreviewPages.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => field.onChange(null)}
                            className="text-red-500 hover:text-red-700 p-1 h-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is this product free?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Sizes (Only for mercantile)
                    </FormLabel>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <FormField
                        key={size}
                        control={form.control}
                        name="size"
                        render={({ field }) => {
                          const currentValues = field.value || [];
                          return (
                            <FormItem
                              key={size}
                              className="flex items-center space-x-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={currentValues.includes(size)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...currentValues, size])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== size
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {size}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availablePaymentMethods"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Available Payment Methods*
                    </FormLabel>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethods.map((method) => (
                      <FormField
                        key={method}
                        control={form.control}
                        name="availablePaymentMethods"
                        render={({ field }) => {
                          const currentValues = field.value || [];
                          return (
                            <FormItem
                              key={method}
                              className="flex items-center space-x-2"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={currentValues.includes(method)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...currentValues,
                                          method,
                                        ])
                                      : field.onChange(
                                          currentValues.filter(
                                            (value) => value !== method
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {method.charAt(0).toUpperCase() +
                                  method.slice(1)}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : product ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
