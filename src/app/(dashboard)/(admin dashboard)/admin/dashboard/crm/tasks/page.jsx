"use client";

import { useState, useMemo } from "react";
import {
  useGetLeadsQuery,
  useCreateLeadTaskMutation,
  useDeleteLeadTaskMutation,
  useUpdateLeadTaskMutation,
  useGetLeadsTasksQuery,
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
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Plus,
  Trash2,
  Check,
  Clock,
  AlertTriangle,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import PermissionError from "@/components/shared/PermissionError";

export default function TaskManagementPage() {
  const { data: response, isLoading, error } = useGetLeadsTasksQuery({});
  const [createLeadTask, { isLoading: isAddingTask }] =
    useCreateLeadTaskMutation();
  const [deleteLeadTask, { isLoading: isDeletingTask }] =
    useDeleteLeadTaskMutation();
  const [updateLeadTask, { isLoading: isUpdatingTask }] =
    useUpdateLeadTaskMutation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leadId: "",
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    leadId: "all",
    dateRange: { start: "", end: "" },
  });

  const leads = response?.data || [];

  // Extract and process tasks
  const tasks = useMemo(() => {
    return leads.reduce((acc, lead) => {
      if (lead.tasks && Array.isArray(lead.tasks)) {
        return [
          ...acc,
          ...lead.tasks.map((task) => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const now = new Date();
            const oneDayBefore = dueDate ? new Date(dueDate) : null;
            if (oneDayBefore) oneDayBefore.setDate(dueDate.getDate() - 1);

            return {
              ...task,
              leadId: lead._id,
              leadName: lead.fullName || "Unknown",
              isExpired: dueDate && dueDate < now,
              isDueSoon: dueDate && oneDayBefore <= now && dueDate >= now,
            };
          }),
        ];
      }
      return acc;
    }, []);
  }, [leads]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === "all" || task.status === filters.status;
      const matchesLead =
        filters.leadId === "all" || task.leadId === filters.leadId;
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start)
        : null;
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end)
        : null;
      const matchesDate =
        !taskDate ||
        ((!startDate || taskDate >= startDate) &&
          (!endDate || taskDate <= endDate));

      return matchesStatus && matchesLead && matchesDate;
    });
  }, [tasks, filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (name, value) => {
    if (name === "startDate" || name === "endDate") {
      setFilters((prev) => ({
        ...prev,
        dateRange: { ...prev.dateRange, [name]: value },
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const { leadId, title, description, dueDate, status } = formData;

    if (!leadId || !title || !dueDate) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>Lead, Title, and Due Date are required.</div>
        </div>
      );
      return;
    }

    try {
      await createLeadTask({
        id: leadId,
        title,
        description,
        dueDate,
        status,
      }).unwrap();
      setIsCreateModalOpen(false);
      setFormData({
        leadId: "",
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
      });
      toast.success(
        <div className="space-y-1">
          <div className="font-semibold">Success</div>
          <div>Task created successfully.</div>
        </div>
      );
    } catch (error) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>
            Failed to create task: {error?.data?.message || error.message}
          </div>
        </div>
      );
    }
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setFormData({
      leadId: task.leadId,
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      status: task.status,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { leadId, title, description, dueDate, status } = formData;

    if (!leadId || !title || !dueDate) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>Lead, Title, and Due Date are required.</div>
        </div>
      );
      return;
    }

    try {
      await updateLeadTask({
        id: editTask.leadId,
        taskId: editTask._id,
        title,
        description,
        dueDate,
        status,
      }).unwrap();
      setIsEditModalOpen(false);
      setEditTask(null);
      setFormData({
        leadId: "",
        title: "",
        description: "",
        dueDate: "",
        status: "pending",
      });
      toast.success(
        <div className="space-y-1">
          <div className="font-semibold">Success</div>
          <div>Task updated successfully.</div>
        </div>
      );
    } catch (error) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>
            Failed to update task: {error?.data?.message || error.message}
          </div>
        </div>
      );
    }
  };

  const handleDeleteTask = async (leadId, taskId) => {
    try {
      await deleteLeadTask({ id: leadId, taskId }).unwrap();
      toast.success(
        <div className="space-y-1">
          <div className="font-semibold">Success</div>
          <div>Task deleted successfully.</div>
        </div>
      );
    } catch (error) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>
            Failed to delete task: {error?.data?.message || error.message}
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-main" />
      </div>
    );
  }

  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError />;
  }

  if (error) {
    toast.error(
      <div className="space-y-1">
        <div className="font-semibold">Error</div>
        <div>Failed to load tasks.</div>
      </div>
    );
    return <div className="text-red p-4">Failed to load tasks</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <Card className="p-5 border-l-4 border-gray1">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-main">Task Management</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="hover:bg-blue/80 hover:text-white gap-1">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="leadId">Lead *</Label>
                  <Select
                    value={formData.leadId}
                    onValueChange={(value) =>
                      handleSelectChange("leadId", value)
                    }
                    required
                  >
                    <SelectTrigger id="leadId">
                      <SelectValue placeholder="Select a lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map((lead) => (
                        <SelectItem key={lead._id} value={lead._id}>
                          {lead.fullName || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Task title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Task description"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={isAddingTask}
                  className="w-full hover:bg-blue/80 hover:text-white"
                >
                  {isAddingTask ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Task"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Task Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="leadId">Lead *</Label>
                <Select
                  value={formData.leadId}
                  onValueChange={(value) => handleSelectChange("leadId", value)}
                  required
                >
                  <SelectTrigger id="leadId">
                    <SelectValue placeholder="Select a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead._id} value={lead._id}>
                        {lead.fullName || "Unknown"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Task description"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={isUpdatingTask}
                className="w-full hover:bg-blue/80 hover:text-white"
              >
                {isUpdatingTask ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Task"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <div className="flex justify-end items-center gap-4 mb-4">
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="statusFilter">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger id="statusFilter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <Label htmlFor="leadFilter">Lead</Label>
            <Select
              value={filters.leadId}
              onValueChange={(value) => handleFilterChange("leadId", value)}
            >
              <SelectTrigger id="leadFilter">
                <SelectValue placeholder="Filter by lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leads</SelectItem>
                {leads.map((lead) => (
                  <SelectItem key={lead._id} value={lead._id}>
                    {lead.fullName || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow
                  key={task._id}
                  className={
                    task.status === "completed"
                      ? "bg-green-50"
                      : task.isExpired
                      ? "bg-red-50"
                      : task.isDueSoon
                      ? "bg-yellow-50"
                      : ""
                  }
                >
                  <TableCell>{task.leadName}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                      {task.isExpired && task.status !== "completed" && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                      {task.isDueSoon && task.status !== "completed" && (
                        <Badge variant="warning">Due Soon</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.status === "completed" ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Completed</span>
                        </>
                      ) : task.status === "in_progress" ? (
                        <>
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>In Progress</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(task)}
                        disabled={isUpdatingTask}
                      >
                        <Pencil className="h-4 w-4 " />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.leadId, task._id)}
                        disabled={isDeletingTask}
                      >
                        {isDeletingTask ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
