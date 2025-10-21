"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";
import { useCreateModuleMutation } from "@/redux/features/module/module.api";
import { useGetSubjectsQuery } from "@/redux/features/curriculum/subject.api";

export default function CreateModuleModal({ open, setOpen, courseId }) {
  const [createModule, { isLoading }] = useCreateModuleMutation();
  const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjectsQuery();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    SubjectId: "",
    CourseId: courseId,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      CourseId: courseId,
    }));
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value) => {
    setFormData((prev) => ({ ...prev, SubjectId: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createModule(formData).unwrap();
      toast.success("Module created successfully");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        SubjectId: "",
        CourseId: courseId,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create module");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create New Module
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter module title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter module description"
                required
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Subject</Label>
              <Select
                value={formData.SubjectId}
                onValueChange={handleSubjectChange}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="z-[100] max-h-64 overflow-y-auto bg-white rounded-md shadow-md border">
  {isLoadingSubjects ? (
    <SelectItem value="" disabled className="py-2 px-4 text-sm text-muted-foreground">
      Loading subjects...
    </SelectItem>
  ) : subjects.length > 0 ? (
    subjects.map((subject) => (
      <SelectItem
        key={subject._id}
        value={subject._id}
        className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
      >
        {subject.name || "Untitled"}
      </SelectItem>
    ))
  ) : (
    <SelectItem value="" disabled className="py-2 px-4">
      No subjects found
    </SelectItem>
  )}
</SelectContent>

              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isLoadingSubjects}>
              {isLoading ? "Creating..." : "Create Module"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
