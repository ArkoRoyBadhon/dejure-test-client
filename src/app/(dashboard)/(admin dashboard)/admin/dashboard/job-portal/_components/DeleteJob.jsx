"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteCareerMutation } from "@/redux/features/career/career.api";

export default function DeleteCareerDialog({ job, onClose }) {
  const [open, setOpen] = useState(false);
  const [deleteCareer, { isLoading }] = useDeleteCareerMutation();

  const handleDelete = async () => {
    try {
      await deleteCareer(job._id).unwrap();
      toast.success("Job deleted successfully");
      setOpen(false);
      onClose?.();
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete job"
          className="w-full flex items-center gap-2"
        >
          <Trash className="h-4 w-4 text-red-500" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the job{" "}
            <span className="font-bold">"{job?.title}"</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
