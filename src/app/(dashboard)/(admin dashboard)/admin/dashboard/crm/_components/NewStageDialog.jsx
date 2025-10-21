"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function NewStageDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  stages = [],
  stage,
}) {
  const [selectedStageId, setSelectedStageId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState(0);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedStageId("");
      setName("");
      setPosition(0);
      return;
    }

    if (stage) {
      // Case: Edit button clicked on a stage
      setSelectedStageId(stage._id);
      setName(stage.title);
      setPosition(stage.position);
    } else if (selectedStageId && selectedStageId !== "new") {
      // Case: Stage selected from dropdown
      const selectedStage = stages.find((s) => s._id === selectedStageId);
      if (selectedStage) {
        setName(selectedStage.title);
        setPosition(selectedStage.position);
      }
    } else {
      // Case: Create new stage - set position to end
      setName("");
      const maxPosition =
        stages.length > 0 ? Math.max(...stages.map((s) => s.position)) + 1 : 0;
      setPosition(maxPosition);
    }
  }, [open, selectedStageId, stages, stage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      title: name.trim(),
      position: Math.max(0, Number(position)),
    };

    // Validate position
    if (isNaN(data.position)) {
      toast.error("Please enter a valid position number");
      return;
    }

    // Include id for updates if a stage is selected or provided
    if (stage || (selectedStageId && selectedStageId !== "new")) {
      data.id = stage ? stage._id : selectedStageId;
    }

    onSave(data);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!selectedStageId || selectedStageId === "new") return;
    const selectedStage = stages.find((s) => s._id === selectedStageId);
    if (selectedStage) {
      onDelete(selectedStage.stageId); // Use stageId for delete
    }
    setIsDeleteConfirmOpen(false);
    onOpenChange(false);
  };

  const isUpdateMode = (selectedStageId && selectedStageId !== "new") || stage;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isUpdateMode ? "Edit Stage" : "Add New Stage"}
            </DialogTitle>
            <DialogDescription>
              {isUpdateMode
                ? "Modify the selected stage details"
                : "Create a new stage for your leads pipeline"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stage-select">Select Stage</Label>
              <Select
                value={selectedStageId}
                onValueChange={setSelectedStageId}
                disabled={!!stage} // Disable dropdown if editing a specific stage
              >
                <SelectTrigger id="stage-select">
                  <SelectValue placeholder="Select a stage to edit or create new" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Create New Stage</SelectItem>
                  {stages.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Stage Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter stage name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                min="0"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Position determines the order of stages (0, 1, 2, 3...)
              </p>
            </div>

            <DialogFooter className="gap-2">
              {isUpdateMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="mr-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isUpdateMode ? "Update" : "Create"} Stage
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this stage? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
