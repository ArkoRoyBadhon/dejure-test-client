"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreateLeadMutation } from "@/redux/features/crm/crm.api";
import { toast } from "sonner";

export function LeadFormDialog({ open, onOpenChange }) {
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const form = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      currentOccupation: "",
      interestedSector: "", // Changed from interestedSector
      educationBackground: "",
      universityName: "", // Added new field
    },
  });

  const onSubmit = async (data) => {
    try {
      await createLead(data).unwrap();
      toast.success("Lead created successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Create lead error:", error);
      toast.error(error.data?.message || "Failed to create lead");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-2">
              {/* Full Name - Mandatory */}
              <FormField
                control={form.control}
                name="fullName"
                rules={{ required: "Full name is required" }}
                render={({ field }) => (
                  <FormItem className={"gap-0"}>
                    <FormLabel className="flex items-center gap-2">
                      Full Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />

              {/* Phone Number - Mandatory */}
              <FormField
                control={form.control}
                name="phone"
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <FormItem className={"gap-0"}>
                    <FormLabel className="flex items-center gap-2">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+8801XXXXXXXXX"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />

              {/* Email - Optional */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 gap-0">
                    <FormLabel className="flex items-center gap-2">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="john@example.com"
                        type="email"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />

              {/* Address - Optional */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 gap-0">
                    <FormLabel className="flex items-center gap-2">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123 Main St, City"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />

              {/* Current Occupation - Optional */}
              <FormField
                control={form.control}
                name="currentOccupation"
                render={({ field }) => (
                  <FormItem className={"gap-0"}>
                    <FormLabel className="flex items-center gap-2">
                      Current Occupation
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Student/Job Title"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />

              {/* Interested Course - interestedSector */}
              <FormField
                control={form.control}
                name="interestedSector"
                render={({ field }) => (
                  <FormItem className={"gap-0"}>
                    <FormLabel className="flex items-center gap-2">
                      Interested Course
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BAR">BAR</SelectItem>
                        <SelectItem value="BJS">BJS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />

              {/* Education Background - Optional */}
              <FormField
                control={form.control}
                name="educationBackground"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 gap-0">
                    <FormLabel className="flex items-center gap-2">
                      Education Background
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. BSc in CSE"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />

              {/* University Name - Optional */}
              <FormField
                control={form.control}
                name="universityName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 gap-0">
                    <FormLabel className="flex items-center gap-2">
                      University Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. University of Dhaka"
                        className="w-full bg-gray1 px-4 sm:px-[18px] py-3 sm:py-[20px] rounded-[16px]"
                      />
                    </FormControl>
                    <FormMessage className="text-red text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Lead"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
