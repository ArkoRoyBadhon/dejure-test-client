"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useUpdateResourceMutation,
  useGetResourcesByCourseQuery,
} from "@/redux/features/resource/resource.api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";

export default function Resources({ id }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const { data: resourcesData, isLoading: resourcesLoading } =
    useGetResourcesByCourseQuery(id);
  const resources = resourcesData || [];
  const [createResource, { isLoading: isCreating }] =
    useCreateResourceMutation();
  const [updateResource, { isLoading: isUpdating }] =
    useUpdateResourceMutation();
  const [deleteResource] = useDeleteResourceMutation();

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setSelectedResource(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return toast.error("Please provide a title");
    if (!selectedResource && !file)
      return toast.error("Please select a PDF file");

    const formData = new FormData();
    formData.append("course", id);
    formData.append("title", title);
    if (file) formData.append("file", file);

    try {
      if (selectedResource) {
        await updateResource({
          id: selectedResource._id,
          data: formData,
        }).unwrap();
        toast.success("Resource updated successfully");
      } else {
        await createResource(formData).unwrap();
        toast.success("Resource uploaded successfully");
      }

      resetForm();
      setOpenDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResource(selectedResource._id).unwrap();
      toast.success("Deleted successfully");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setTitle(resource.title);
    setFile(null);
    setOpenDialog(true);
  };

  const handlePreview = (resource) => {
    setPreviewResource(resource);
    setOpenPreviewDialog(true);
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-[#F2F7FC] rounded-t-xl border flex justify-between items-center mb-4">
        <div className="grid grid-cols-3 w-full text-sm font-medium text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-[#141B34] font-bold text-lg">রিসোর্স</span>
          </div>
          <div></div>
        </div>
      </div>

      <div className="border m-4 rounded-xl">
        {/* Header with Create Button */}
        <div className="px-6 py-3 bg-[#F2F7FC] rounded-t-xl border-b flex justify-between items-center">
          <div className="grid grid-cols-3 w-full text-sm font-medium text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-[#141B34] font-bold">শিরোনাম</span>
            </div>
            <div></div>
            <div className="text-[#141B34] font-bold text-center">একশন</div>
          </div>

          {isAdmin && (
            <Dialog
              open={openDialog}
              onOpenChange={(open) => {
                if (!open) resetForm();
                setOpenDialog(open);
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-main hover:bg-main text-black h-8">
                  <Plus className="h-4 w-4" />
                  Create Resource
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    {selectedResource ? "Edit Resource" : "Add New Resource"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Resource title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">
                      PDF File {!selectedResource && "(required)"}
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0])}
                      required={!selectedResource}
                    />
                    {selectedResource && !file && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Current file will be kept if no new file is selected
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="w-full bg-main hover:bg-main text-black"
                  >
                    {isCreating || isUpdating
                      ? "Processing..."
                      : selectedResource
                      ? "Update Resource"
                      : "Upload Resource"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Preview Dialog */}
        <Dialog open={openPreviewDialog} onOpenChange={setOpenPreviewDialog}>
          <DialogContent className="custom-dialog-width2 w-full h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{previewResource?.title || "Preview"}</DialogTitle>
            </DialogHeader>
            <div className="flex-1">
              {previewResource && (
                <iframe
                  src={`${getFileUrl(
                    previewResource.resource
                  )}#toolbar=0&navpanes=0&zoom=100`}
                  className="w-full h-full border rounded-md"
                  title="PDF Preview"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              resource.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {resourcesLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No resources available for this course yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {resourcesData.map((res) => (
              <div
                key={res._id}
                className="p-4 grid grid-cols-3 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {res.title || "Untitled Resource"}
                  </p>
                </div>
                <div></div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(res)}
                    title="Preview"
                    className="text-gray-700 hover:bg-gray-200 border-gray-300"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    ভিউ করুন
                  </Button>

                  {/* <a
                    href={getFileUrl(res.resource)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-700 hover:bg-gray-200 border-gray-300"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      download করুন
                    </Button>
                  </a> */}

                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(res)}
                        className="text-gray-700 hover:bg-gray-200 border-gray-300"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedResource(res);
                          setOpenDeleteDialog(true);
                        }}
                        className="hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
