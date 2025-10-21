"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { useDeleteCouponMutation } from "@/redux/features/coupon/coupon.api";

export function DeleteDialog({ coupon, children }) {
  const [open, setOpen] = useState(false);
  const [deleteCoupon, { isLoading }] = useDeleteCouponMutation();

  const handleDelete = async () => {
    try {
      await deleteCoupon(coupon._id).unwrap();
      toast("Coupon deleted successfully");
      setOpen(false);
    } catch (error) {
      toast(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Coupon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the coupon{" "}
            <span className="font-bold">"{coupon?.code}"</span>? This action
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
