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
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateTimelineMutation,
  useUpdateTimelineMutation,
} from "@/redux/features/timeline/timeline.api";

// ✅ Validation Schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  subTitle: z.string().min(2, "Subtitle must be at least 2 characters."),
  link: z.string().url("Please enter a valid URL"),
});

export function CreateTimelineDialog({ timeline, children, onClose }) {
  const [open, setOpen] = useState(false);

  const [createTimeline, { isLoading: isCreating }] =
    useCreateTimelineMutation();
  const [updateTimeline, { isLoading: isUpdating }] =
    useUpdateTimelineMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: timeline?.title || "",
      subTitle: timeline?.subTitle || "",
      link: timeline?.link || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: timeline?.title || "",
        subTitle: timeline?.subTitle || "",
        link: timeline?.link || "",
      });
    }
  }, [open, timeline, form]);

  async function onSubmit(values) {
    try {
      if (timeline) {
        await updateTimeline({ id: timeline._id, patch: values }).unwrap();
        toast.success("Timeline updated successfully");
      } else {
        await createTimeline(values).unwrap();
        toast.success("Timeline created successfully");
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
            Create Timeline
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="custom-dialog-width2 h-[45vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {timeline ? "Edit Timeline" : "Create Timeline"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Timeline title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtitle */}
            <FormField
              control={form.control}
              name="subTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="Timeline subtitle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-yellow-50 border border-yellow-300"
                      placeholder="https://example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-1/2 flex mx-auto items-center justify-center border"
            >
              {isCreating || isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : timeline ? (
                "Update Timeline"
              ) : (
                "Create Timeline"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
