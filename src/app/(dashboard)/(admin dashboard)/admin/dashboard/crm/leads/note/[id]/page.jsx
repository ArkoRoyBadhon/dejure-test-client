"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetLeadNotesQuery,
  useCreateLeadNoteMutation,
  useUpdateLeadNoteMutation,
  useDeleteLeadNoteMutation,
} from "@/redux/features/crm/crm.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Pencil, Trash2, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NotePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: response, isLoading, refetch } = useGetLeadNotesQuery(id);
  const [createLeadNote] = useCreateLeadNoteMutation();
  const [updateLeadNote] = useUpdateLeadNoteMutation();
  const [deleteLeadNote] = useDeleteLeadNoteMutation();

  const notes = response?.data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    content: "",
  });

  const handleCreateOrUpdateNote = async (e) => {
    e.preventDefault();
    if (!currentNote.content.trim()) {
      toast.error("Note content is required");
      return;
    }

    try {
      if (currentNote._id) {
        await updateLeadNote({
          id,
          noteId: currentNote._id,
          content: currentNote.content,
        }).unwrap();
        toast.success("Note updated");
      } else {
        await createLeadNote({ id, content: currentNote.content }).unwrap();
        toast.success("Note created");
      }
      refetch();
      setIsModalOpen(false);
      setCurrentNote({ content: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteLeadNote({ id, noteId }).unwrap();
      toast.success("Note deleted");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete note");
    }
  };

  const openEditModal = (note) => {
    setCurrentNote({
      _id: note._id,
      content: note.content,
    });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Card className="p-5 border-l-4 border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notes</h1>
            <p className="text-sm text-gray-500">Manage lead notes</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/dashboard/crm/leads/details/${id}`)
              }
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lead
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1" onClick={() => setIsModalOpen(true)}>
                  <Plus className="h-4 w-4" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {currentNote._id ? "Edit Note" : "Create New Note"}
                  </DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={handleCreateOrUpdateNote}
                  className="space-y-4 mt-2"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Content*
                    </label>
                    <Textarea
                      value={currentNote.content}
                      onChange={(e) =>
                        setCurrentNote({
                          ...currentNote,
                          content: e.target.value,
                        })
                      }
                      placeholder="Enter note content"
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {currentNote._id ? "Update Note" : "Create Note"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Note List */}
        <div className="">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No notes created yet</div>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </div>
          ) : (
            <Table className="border rounded-lg">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[80%]">Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="whitespace-pre-wrap">{note.content}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(note)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Note?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this note.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNote(note._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
