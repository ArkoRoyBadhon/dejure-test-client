"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteRecordMutation } from "@/redux/features/records/records.api";

export default function RecordDeleteDialog({ open, setOpen, record }) {
  const [deleteRecord, { isLoading }] = useDeleteRecordMutation();

  const handleDelete = async () => {
    try {
      await deleteRecord(record._id).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this section?
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
