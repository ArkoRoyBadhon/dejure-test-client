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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreateCareerMutation,
  useUpdateCareerMutation,
} from "@/redux/features/career/career.api";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  image: z.any().optional(),
  salaryRange: z.string().optional(),
  type: z.enum(["hybrid", "remote", "onsite"]),
  location: z.string().optional(),
  experience: z.string().min(1, "Experience is required."),
  isActive: z.boolean().optional(),
  link: z.string(),
  qualification: z.string().optional(),
  deadline: z.string().optional(),
});

export function CreateCareerDialog({ job, children, onClose }) {
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [createCareer, { isLoading: isCreating }] = useCreateCareerMutation();
  const [updateCareer, { isLoading: isUpdating }] = useUpdateCareerMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title || "",
      image: null,
      salaryRange: job?.salaryRange || "",
      type: job?.type || "remote",
      location: job?.location || "",
      experience: job?.experience || "",
      isActive: job?.isActive ?? true,
      link: job?.link || "",
      qualification: job?.qualification || "",
      deadline: job?.deadline || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: job?.title || "",
        image: null,
        salaryRange: job?.salaryRange || "",
        type: job?.type || "remote",
        location: job?.location || "",
        experience: job?.experience || "",
        isActive: job?.isActive ?? true,
        link: job?.link || "",
        qualification: job?.qualification || "",
        deadline: job?.deadline || "",
      });
      setPreviewImage(job?.image || null);
    }
  }, [open, job, form]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("image", null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("salaryRange", values.salaryRange || "");
    formData.append("type", values.type);
    formData.append("location", values.location || "");
    formData.append("experience", values.experience);
    formData.append("isActive", values.isActive);
    formData.append("link", values.link);
    formData.append("qualification", values.qualification || "");
    formData.append("deadline", values.deadline || "");
    if (values.image) formData.append("image", values.image);

    try {
      if (job) {
        await updateCareer({ id: job._id, patch: formData }).unwrap();
        toast.success("Job updated successfully");
      } else {
        await createCareer(formData).unwrap();
        toast.success("Job created successfully");
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
            Create Job
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="custom-dialog-width2 h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {job ? "Edit Job" : "Create Job"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Job title"
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

            {previewImage && (
              <div className="relative flex justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
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

            <FormField
              control={form.control}
              name="salaryRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Ex: $50k-$70k"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-yellow-50 border border-yellow-300">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-yellow-50 border border-yellow-300">
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Job location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Required experience"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="bg-yellow-50 border border-yellow-300"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Active Job</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="https://example.com/apply"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Ex: BBA/MBA"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="bg-yellow-50 border border-yellow-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-1/2 flex mx-auto items-center justify-center border"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : job ? (
                "Update Job"
              ) : (
                "Create Job"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
