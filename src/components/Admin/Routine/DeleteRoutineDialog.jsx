"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteRoutineMutation } from "@/redux/features/routine/routine.api";
import { toast } from "sonner";

export default function DeleteRoutineDialog({ open, onOpenChange, routineId }) {
  const [deleteRoutine] = useDeleteRoutineMutation();

  const handleDelete = async () => {
    try {
      await deleteRoutine(routineId).unwrap();
      onOpenChange(false);
      toast.success("Routine Deleted SuccessFully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete routine");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Routine</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this routine? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
