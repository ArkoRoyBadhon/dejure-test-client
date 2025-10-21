"use client";

import { useState, useMemo } from "react";
import { Eye, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllFreeResourcesQuery,
  useCreateFreeResourceMutation,
  useUpdateFreeResourceMutation,
  useDeleteFreeResourceMutation,
} from "@/redux/features/free-resources/free-resources.api";
import { Button } from "@/components/ui/button";
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

import Loader from "@/components/shared/Loader";
import PermissionError from "@/components/shared/PermissionError";
export default function FreeResourcesPage() {
  const {
    data: resourcesData,
    isLoading,
    error,
  } = useGetAllFreeResourcesQuery();
  const resources = resourcesData || [];

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ isActive: false });

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [previewResource, setPreviewResource] = useState(null);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [createResource, { isLoading: isCreating }] =
    useCreateFreeResourceMutation();
  const [updateResource, { isLoading: isUpdating }] =
    useUpdateFreeResourceMutation();
  const [deleteResource, { isLoading: isDeleting }] =
    useDeleteFreeResourceMutation();

  // Filter and search
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesSearch =
        searchTerm === "" ||
        res.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = !filters.isActive || res.isActive;
      return matchesSearch && matchesFilters;
    });
  }, [resources, searchTerm, filters]);

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

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

  const handleDelete = async () => {
    try {
      await deleteResource(selectedResource._id).unwrap();
      toast.success("Deleted successfully");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  };

  if (error?.data?.message === "Insufficient module permissions")
    return <PermissionError  />;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="rounded-xl shadow-md">
        {/* Header */}
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
          <h1 className="text-[#141B34] font-bold text-xl">
            Manage Free Resources
          </h1>
          {isAdmin && (
            <Dialog
              open={openDialog}
              onOpenChange={(open) => {
                if (!open) resetForm();
                setOpenDialog(open);
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-main hover:bg-main text-black h-8 flex items-center gap-1">
                  <Plus size={16} /> Create Resource
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

        {/* Search and Filters */}
        <div className="p-4 bg-white border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by title"
              className="flex-1 p-2 border rounded-lg bg-yellow-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.isActive}
                  onChange={() => toggleFilter("isActive")}
                  className="w-4 h-4 accent-yellow-500"
                />
                Active Only
              </label>
            </div>
          </div>
        </div>

        {/* Resources Table */}
        <div className="p-4 bg-white rounded-b-xl">
          {isLoading ? (
            <Loader />
          ) : filteredResources?.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredResources.map((res) => (
                <div
                  key={res._id}
                  className="p-4 grid grid-cols-3 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-2">{res.title}</div>
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(res)}
                      title="Preview"
                      className="text-gray-700 hover:bg-gray-200 border-gray-300"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
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
          ) : (
            <p className="text-center text-gray-500">No resources found</p>
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
                    previewResource.file
                  )}#toolbar=0&navpanes=0&zoom=100`}
                  className="w-full h-full border rounded-md"
                  title="PDF Preview"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
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
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
