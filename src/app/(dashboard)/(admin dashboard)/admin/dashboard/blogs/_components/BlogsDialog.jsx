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
import { useState, useEffect, useRef } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "@/redux/features/Blog/Blog.api";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Loader from "@/components/shared/Loader";

// React Quill import
// import ReactQuill from "react-quill";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <Loader text="Loading editor..." />, // optional
});
import "react-quill/dist/quill.snow.css";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters." }),
  image: z.any().optional(),
  ishighlighted: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isApproved: z.boolean().optional(),
});

export function CreateBlogDialog({ blog, children, onClose }) {
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog?.title || "",
      description: blog?.description || "",
      image: null,
      ishighlighted: blog?.ishighlighted || false,
      isFeatured: blog?.isFeatured || false,
      isApproved: blog ? blog.isApproved : isAdmin ? true : false,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: blog?.title || "",
        description: blog?.description || "",
        image: null,
        ishighlighted: blog?.ishighlighted || false,
        isFeatured: blog?.isFeatured || false,
        isApproved: blog ? blog.isApproved : isAdmin ? true : false,
      });
      setPreviewImage(
        blog?.image ? `${process.env.NEXT_PUBLIC_API_URL}/${blog.image}` : null
      );
    }
  }, [open, blog, form, isAdmin]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image", null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description); // Quill content is HTML
    if (values.image) {
      formData.append("image", values.image);
    }
    formData.append("ishighlighted", values.ishighlighted);
    formData.append("isFeatured", values.isFeatured);
    formData.append("isApproved", values.isApproved);

    try {
      if (blog) {
        await updateBlog({ id: blog._id, formData }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formData).unwrap();
        toast.success("Blog created successfully");
      }
      setOpen(false);
      onClose?.();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <div onClick={() => setOpen(true)}>{children}</div>
      ) : (
        <DialogTrigger asChild>
          <Button
            className="bg-yellow-50 hover:bg-yellow-200 border border-yellow-300"
            variant="outline"
          >
            Create Blog
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="custom-dialog-width2 h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {blog ? "Edit Blog" : "Create Blog"}
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
                    <Input
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Blog title"
                      {...field}
                    />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={{
                        toolbar: [
                          ["bold", "italic", "underline"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "blockquote", "code-block"],
                        ],
                      }}
                      placeholder="Type your content here..."
                      style={{ height: "300px", marginBottom: "2rem" }}
                      className=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="cursor-pointer bg-yellow-50 border border-yellow-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(previewImage || blog?.image) && (
              <div className="relative flex justify-center">
                <img
                  src={
                    previewImage ||
                    `${process.env.NEXT_PUBLIC_API_URL}/${blog.image}`
                  }
                  alt={blog?.title || "Preview"}
                  className="h-40 w-full object-contain rounded-md border"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4 text-gray-700" />
                </Button>
              </div>
            )}

            {isAdmin && (
              <>
                <FormField
                  control={form.control}
                  name="ishighlighted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="bg-yellow-50 border border-yellow-300"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Highlight this blog
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="bg-yellow-50 border border-yellow-300"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Feature this blog
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-1/2 flex mx-auto items-center justify-center border"
            >
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : blog ? (
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
