"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDeleteStaffRoleMutation } from "@/redux/features/auth/staff.api";

const DeleteRoleDialog = ({ roleId, onSuccess, children }) => {
  const [open, setOpen] = useState(false);
  const [deleteStaffRole] = useDeleteStaffRoleMutation();

  const handleDelete = async () => {
    try {
      await deleteStaffRole(roleId).unwrap();
      toast.success("Role deleted successfully");
      onSuccess();
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete role");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Role Deletion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to delete this role? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoleDialog;
