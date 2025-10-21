import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateResourceMutation,
  useDeleteResourceMutation,
  useGetAllResourcesQuery,
  useUpdateResourceMutation,
} from "@/redux/features/resource/resource.api";

export default function VideoPlayer({
  video,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  courseId,
}) {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // State for notes management
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [previewNote, setPreviewNote] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  // Only fetch notes if we have a valid video ID
  const {
    data: notesData,
    isLoading: notesLoading,
    refetch,
  } = useGetAllResourcesQuery(undefined, {
    skip: !video?._id, // Skip if no video is selected
  });

  // Filter notes for the current video/class
  const notes = video?._id
    ? notesData?.filter((note) => note?.class === video?._id) || []
    : [];

  const [createNote, { isLoading: isCreating }] = useCreateResourceMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateResourceMutation();
  const [deleteNote] = useDeleteResourceMutation();

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setSelectedNote(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) return toast.error("Please provide a title");
    if (!selectedNote && !file) return toast.error("Please select a PDF file");

    const formData = new FormData();
    formData.append("class", video._id);
    formData.append("course", courseId);
    formData.append("title", title);
    if (file) formData.append("file", file);

    try {
      if (selectedNote) {
        await updateNote({
          id: selectedNote._id,
          data: formData,
        }).unwrap();
        toast.success("Note updated successfully");
      } else {
        await createNote(formData).unwrap();
        toast.success("Note uploaded successfully");
      }

      resetForm();
      setOpenDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote(selectedNote._id).unwrap();
      toast.success("Deleted successfully");
      setOpenDeleteDialog(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setFile(null);
    setOpenDialog(true);
  };

  const handlePreview = (note) => {
    setPreviewNote(note);
    setOpenPreviewDialog(true);
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  };

  return (
    <div className="w-full p-4">
      {/* Video Player */}
      <div className="bg-black rounded-md">
        <div className="relative w-full h-[355px] overflow-hidden rounded-md">
          {video?.url ? (
            <iframe
              src={`https://player.vimeo.com/video/${video.url
                .split("/")
                .pop()}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white text-xl font-semibold">
              Please select a video to watch
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 mt-4">
        <h3 className="text-lg font-semibold">{video?.title}</h3>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between bg-[#EEEEEE] p-1 rounded-xl w-full gap-1">
        <button
          className="w-full bg-white hover:bg-gray-50 rounded-xl text-[#74767C] font-bold disabled:opacity-50 shadow-md py-2"
          onClick={onPrev}
          disabled={!hasPrev}
        >
          পূর্ববর্তী
        </button>
        <button
          className="w-full text-[#141B34] font-bold py-2 bg-[#FFB800] rounded-xl hover:bg-yellow-400 disabled:opacity-50"
          onClick={onNext}
          disabled={!hasNext}
        >
          পরবর্তী
        </button>
      </div>

      {/* Notes Section - Only show if a video is selected */}
      {video?._id && (
        <div className="mt-6 border rounded-xl">
          {/* Notes List Header */}
          <div className="px-6 py-3 bg-[#F2F7FC] rounded-t-xl border-b flex justify-between items-center">
            <div className="grid grid-cols-3 w-full text-sm font-medium text-gray-600">
              <div className="flex items-center gap-1">
                <span className="text-[#141B34] font-bold">Notes</span>
              </div>
              <div></div>
              <div className="text-[#141B34] font-bold text-center">
                Actions
              </div>
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
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      {selectedNote ? "Edit Note" : "Add New Note"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">
                        PDF File {!selectedNote && "(required)"}
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0])}
                        required={!selectedNote}
                      />
                      {selectedNote && !file && (
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
                        : selectedNote
                        ? "Update Note"
                        : "Upload Note"}
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
                <DialogTitle>{previewNote?.title || "Preview"}</DialogTitle>
              </DialogHeader>
              <div className="flex-1">
                {previewNote && (
                  <iframe
                    src={`${getFileUrl(
                      previewNote.resource
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
                note.
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

          {notesLoading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notes available for this video yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 grid grid-cols-3 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {note.title || "Untitled Note"}
                    </p>
                  </div>
                  <div></div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(note)}
                      title="Preview"
                      className="text-gray-700 hover:bg-gray-200 border-gray-300"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      ভিউ করুন
                    </Button>

                    {/* <a
                      href={getFileUrl(note.resource)}
                      download={note.title || "note"}
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
                          onClick={() => handleEdit(note)}
                          className="text-gray-700 hover:bg-gray-200 border-gray-300"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedNote(note);
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
      )}
    </div>
  );
}
