"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateActivityGalleryMutation } from "@/redux/features/WebManage/Activity.api";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

// Form validation schema for a single activity
const activitySchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  image: z.any().optional(),
});

// Form validation schema for the entire form
const formSchema = z.object({
  tabName: z.string().min(1, { message: "Tab name is required" }),
  activities: z.array(activitySchema).min(1).max(6),
});

export function CreateActivityDialog() {
  const [open, setOpen] = useState(false);
  const [createActivityGallery, { isLoading }] =
    useCreateActivityGalleryMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tabName: "",
      activities: [{ title: "", image: undefined }],
    },
  });

  const { control, handleSubmit, watch, setValue } = form;
  const activities = watch("activities");

  const addActivity = () => {
    if (activities.length < 6) {
      setValue("activities", [...activities, { title: "", image: undefined }]);
    }
  };

  const removeActivity = (index) => {
    if (activities.length > 1) {
      const newActivities = [...activities];
      newActivities.splice(index, 1);
      setValue("activities", newActivities);
    }
  };

  const onSubmit = async (values) => {
    try {
      // Check if there are exactly 6 activities
      if (values.activities.length !== 6) {
        toast.error("You must add exactly 6 activities");
        return;
      }
      const formData = new FormData();

      // Append tab name
      formData.append("tabName", values.tabName);

      // Append each activity's data
      values.activities.forEach((activity, index) => {
        formData.append(`activities[${index}][title]`, activity.title);

        if (activity.image && activity.image[0]) {
          formData.append(`images`, activity.image[0]);
        }
      });

      await createActivityGallery(formData).unwrap();

      toast.success("Activities created successfully");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.error || "Failed to create activities");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FFB800] hover:bg-[#e6a600]">
          Create Activity Gallery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Create Activity Gallery
          </DialogTitle>
          <DialogDescription className="text-center text-red-500">
            Add a tab name and must 6 activities to the gallery.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tab Name Field */}
            <FormField
              control={control}
              name="tabName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tab Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tab name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              {activities.map((_, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                  {activities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removeActivity(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}

                  <h3 className="font-medium mb-3">Activity {index + 1}</h3>

                  <FormField
                    control={control}
                    name={`activities.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter activity title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`activities.${index}.image`}
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {activities.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={addActivity}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Activity
              </Button>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#FFB800] hover:bg-[#e6a600]"
              >
                {isLoading
                  ? "Creating..."
                  : `Create ${activities.length} Activity${
                      activities.length > 1 ? "ies" : ""
                    }`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
