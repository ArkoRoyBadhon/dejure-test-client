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
import { useDeleteTimelineMutation } from "@/redux/features/timeline/timeline.api";

export default function DeleteTimelineDialog({ timeline, onClose }) {
  const [open, setOpen] = useState(false);
  const [deleteTimeline, { isLoading }] = useDeleteTimelineMutation();

  const handleDelete = async () => {
    try {
      await deleteTimeline(timeline._id).unwrap();
      toast.success("Timeline deleted successfully");
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
          aria-label="Delete timeline"
          className="w-full flex items-center gap-2"
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Timeline</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the timeline{" "}
            <span className="font-bold">"{timeline?.title}"</span>? This action
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
