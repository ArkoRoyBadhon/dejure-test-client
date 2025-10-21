"use client";

import { useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import LearnersSelect from "./LearnersSelect";
import MentorsSelect from "./MentorsSelect";
import { noticeFormSchema } from "./schemas";
import { Badge } from "@/components/ui/badge";

// Add notification types to your schema (update your schemas.js file accordingly)
const notificationTypes = [
  { id: "in_app", label: "In-App" },
  { id: "push", label: "Push Notification" },
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
];

export default function CreateNoticeDialog({
  learners,
  mentors,
  onSubmit,
  isOpen,
  setIsOpen,
}) {
  const form = useForm({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      learners: [],
      mentors: [],
      isImportant: false,
      notificationTypes: ["in_app"], // Default to in-app only
    },
  });

  const handleSubmit = useCallback(
    async (values) => {
      await onSubmit(values);
      form.reset();
    },
    [onSubmit, form]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center">
          <Plus className="mr-2 h-4 w-4" />
          Create Notice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Notice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input placeholder="Enter notice title" {...field} />
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
                  <Textarea
                    placeholder="Enter notice description"
                    rows={4}
                    {...field}
                    className={"bg-gray1"}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LearnersSelect control={form.control} learners={learners} />
              <MentorsSelect control={form.control} mentors={mentors} />
            </div>

            <FormField
              control={form.control}
              name="notificationTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Methods</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {notificationTypes.map((type) => (
                      <Badge
                        key={type.id}
                        variant={
                          field.value?.includes(type.id) ? "default" : "outline"
                        }
                        className={`cursor-pointer ${
                          field.value?.includes(type.id)
                            ? "bg-main text-darkColor hover:bg-main/90"
                            : ""
                        }`}
                        onClick={() => {
                          const currentValues = field.value || [];
                          const newValues = currentValues.includes(type.id)
                            ? currentValues.filter((id) => id !== type.id)
                            : [...currentValues, type.id];
                          field.onChange(newValues);
                        }}
                      >
                        {type.label}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isImportant"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-main data-[state=checked]:border-main"
                  />
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as important</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Notice</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
