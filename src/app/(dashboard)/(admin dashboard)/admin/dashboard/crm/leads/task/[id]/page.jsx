"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetLeadTasksQuery,
  useCreateLeadTaskMutation,
  useUpdateLeadTaskMutation,
  useDeleteLeadTaskMutation,
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-gray-400" },
  { value: "in_progress", label: "In Progress", color: "bg-blue-400" },
  { value: "completed", label: "Completed", color: "bg-green-400" },
];

export default function TaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: response, isLoading, refetch } = useGetLeadTasksQuery(id);
  const [createLeadTask] = useCreateLeadTaskMutation();
  const [updateLeadTask] = useUpdateLeadTaskMutation();
  const [deleteLeadTask] = useDeleteLeadTaskMutation();

  const tasks = response?.data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  // Process tasks to include due date status
  const processedTasks = tasks.map((task) => {
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const now = new Date();
    const oneDayBefore = dueDate ? new Date(dueDate) : null;
    if (oneDayBefore) oneDayBefore.setDate(dueDate.getDate() - 1);

    return {
      ...task,
      isExpired: dueDate && dueDate < now,
      isDueSoon: dueDate && oneDayBefore <= now && dueDate >= now,
    };
  });

  const handleStatusChange = async (taskId, currentStatus) => {
    const currentIndex = statusOptions.findIndex(
      (s) => s.value === currentStatus
    );
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const newStatus = statusOptions[nextIndex].value;

    try {
      await updateLeadTask({
        id,
        taskId,
        status: newStatus,
      }).unwrap();
      toast.success(`Status changed to ${statusOptions[nextIndex].label}`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    if (!currentTask.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (currentTask._id) {
        await updateLeadTask({
          id,
          taskId: currentTask._id,
          ...currentTask,
        }).unwrap();
        toast.success("Task updated");
      } else {
        await createLeadTask({ id, ...currentTask }).unwrap();
        toast.success("Task created");
      }
      refetch();
      setIsModalOpen(false);
      setCurrentTask({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteLeadTask({ id, taskId }).unwrap();
      toast.success("Task deleted");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete task");
    }
  };

  const openEditModal = (task) => {
    setCurrentTask({
      _id: task._id,
      title: task.title,
      description: task.description || "",
      // status: task.status,
      dueDate: task.dueDate?.split("T")[0] || "",
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
            <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
            <p className="text-sm text-gray-500">
              Manage lead tasks efficiently
            </p>
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
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {currentTask._id ? "Edit Task" : "Create New Task"}
                  </DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={handleCreateOrUpdateTask}
                  className="space-y-4 mt-2"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title*
                      </label>
                      <Input
                        value={currentTask.title}
                        onChange={(e) =>
                          setCurrentTask({
                            ...currentTask,
                            title: e.target.value,
                          })
                        }
                        placeholder="Task title"
                        className="w-full"
                      />
                    </div>

                    <div c>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Due Date
                        </label>
                        <Input
                          type="date"
                          value={currentTask.dueDate}
                          onChange={(e) =>
                            setCurrentTask({
                              ...currentTask,
                              dueDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <Textarea
                        value={currentTask.description}
                        onChange={(e) =>
                          setCurrentTask({
                            ...currentTask,
                            description: e.target.value,
                          })
                        }
                        placeholder="Task details"
                        className="min-h-[100px]"
                      />
                    </div>
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
                      {currentTask._id ? "Update Task" : "Create Task"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Task List */}
        <div className="">
          {processedTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No tasks created yet</div>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Button>
            </div>
          ) : (
            <Table className="border rounded-lg">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[40%]">Task</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedTasks.map((task) => {
                  const currentStatus = statusOptions.find(
                    (s) => s.value === task.status
                  );
                  return (
                    <TableRow
                      key={task._id}
                      className={
                        task.status === "completed"
                          ? "bg-green-50"
                          : task.isExpired
                          ? "bg-red-50"
                          : task.isDueSoon
                          ? "bg-yellow-50"
                          : "hover:bg-gray-50"
                      }
                    >
                      <TableCell>
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {task.description}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 px-3 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(task._id, task.status)
                          }
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${currentStatus?.color}`}
                          ></span>
                          {currentStatus?.label}
                        </Button>
                      </TableCell>

                      <TableCell>
                        {task.dueDate ? (
                          <div className="flex items-center gap-2">
                            <span>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            {task.isExpired && task.status !== "completed" && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                            {task.isDueSoon && task.status !== "completed" && (
                              <Badge variant="warning" className="text-xs">
                                Due Soon
                              </Badge>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(task)}
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
                                <AlertDialogTitle>
                                  Delete Task?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{task.title}"
                                  task.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTask(task._id)}
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
