"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
  useUpdateReviewMutation,
} from "@/redux/features/WebManage/Reviews.api";
import TestimonialCard from "./testoMonialCard";
import ReviewForm from "./ReviewDialog";

export default function ManageTestomonials() {
  const { data: reviews = [], refetch } = useGetAllReviewsQuery();
  const [createReview, { isLoading: creating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: updating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  // Handlers
  const handleCreate = async (form) => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "image" && v) formData.append("image", v);
      else if (k !== "image") formData.append(k, v);
    });
    await createReview(formData);
    setOpenCreate(false);
    refetch();
  };

  const handleEdit = async (form) => {
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "image" && v) formData.append("image", v);
      else if (k !== "image") formData.append(k, v);
    });
    await updateReview({ id: selected._id, data: formData });
    setOpenEdit(false);
    setSelected(null);
    refetch();
  };

  const handleDelete = async () => {
    await deleteReview(selected._id);
    setOpenDelete(false);
    setSelected(null);
    refetch();
  };

  return (
    <div>
      {/* Top right create btn */}
      <div className="flex justify-end mb-4">
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenCreate(true)}>Create Review</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Review</DialogTitle>
            </DialogHeader>
            <ReviewForm onSubmit={handleCreate} loading={creating} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review._id}>
            <TestimonialCard
              review={review}
              onEdit={(r) => {
                setSelected(r);
                setOpenEdit(true);
              }}
              onDelete={(r) => {
                setSelected(r);
                setOpenDelete(true);
              }}
            />
          </div>
        ))}
      </div>

      {/* Update Dialog */}
      <Dialog
        open={openEdit}
        onOpenChange={(v) => {
          setOpenEdit(v);
          if (!v) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Review</DialogTitle>
          </DialogHeader>
          <ReviewForm
            initial={selected}
            onSubmit={handleEdit}
            loading={updating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDelete}
        onOpenChange={(v) => {
          setOpenDelete(v);
          if (!v) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this review?</div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
