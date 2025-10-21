"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteClassMutation } from "@/redux/features/lecture/class.api";

export default function ClassDeleteDialog({ open, setOpen, cls }) {
  const [deleteClass] = useDeleteClassMutation();

  const handleDelete = async () => {
    await deleteClass(cls._id);
    setOpen(false);
  };

  if (!cls) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-bold text-lg">Confirm Delete</DialogTitle>
        <p>Are you sure you want to delete: {cls.title}?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
