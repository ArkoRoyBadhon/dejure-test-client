"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteLectureMutation } from "@/redux/features/lecture/lecture.api";

export default function LectureDeleteDialog({ open, setOpen, lecture }) {
  const [deleteLecture, { isLoading }] = useDeleteLectureMutation();

  const handleDelete = async () => {
    try {
      await deleteLecture(lecture._id).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete lecture:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this subject?
          </DialogTitle>
        </DialogHeader>

        <p className="text-gray-500">This action cannot be undone.</p>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
