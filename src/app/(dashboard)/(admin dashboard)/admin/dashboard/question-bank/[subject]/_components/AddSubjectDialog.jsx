"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useGetSubjectsBySubjectTypeIdQuery } from "@/redux/features/curriculum/subject.api";
import { useUpdateQuestionBankTypeMutation } from "@/redux/features/questionBank/questionBankType.api";

// Schema
const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  code: z.string().optional(),
});

const AddSubjectDialog = ({ questionBankType, onSubjectAdded }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { data: subjects = [] } = useGetSubjectsBySubjectTypeIdQuery(
    questionBankType?.curriculum
  );

  const [updateQuestionBankType] = useUpdateQuestionBankTypeMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      code: "",
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const selectedSubject = subjects.find(
        (subj) => subj._id === values.subject
      );

      if (!selectedSubject) {
        toast.error("Selected subject not found.");
        setLoading(false);
        return;
      }

      await updateQuestionBankType({
        id: questionBankType?.id,
        subjects: [
          ...(questionBankType?.subjects || []), // existing subjects in the QB type
          {
            _id: selectedSubject._id,
            name: selectedSubject.name,
            code: selectedSubject.code || values.code || "", // optional
          },
        ],
      }).unwrap();

      toast.success("Subject added to the question bank.");
      setOpen(false);
      form.reset();
      onSubjectAdded?.();
    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong while adding subject."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Subject
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Subject to {questionBankType?.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="!w-full">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="!w-full">
                      {subjects.length > 0 ? (
                        subjects.map((subject) => (
                          <SelectItem key={subject._id} value={subject._id}>
                            {subject.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                          No subjects found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Subject
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
