"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  useGetLeadsQuery,
  useUpdateLeadStageMutation,
  useConvertLeadMutation,
  useGetStagesQuery,
  useAddStageMutation,
  useUpdateStageMutation,
  useUpdateStagePositionsMutation,
  useDeleteStageMutation,
  useDeleteLeadMutation,
} from "@/redux/features/crm/crm.api";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { SortableItem } from "./SortableItem";
import { SortableStage } from "./SortableStage";
import { NewStageDialog } from "./NewStageDialog";
import { LeadCard } from "./LeadCard";
import { LeadFormDialog } from "./LeadFormDialog";
import PermissionError from "@/components/shared/PermissionError";

export default function CRMLeads() {
  const {
    data: leadsResponse,
    isLoading: isLoadingLeads,
    refetch: refetchLeads,
    error: leadsError,
  } = useGetLeadsQuery();
  const {
    data: stagesData,
    isLoading: isLoadingStages,
    refetch: refetchStages,
    error: stagesError,
  } = useGetStagesQuery();
  const [updateLeadStage] = useUpdateLeadStageMutation();
  const [convertLead, { isLoading: isConverting }] = useConvertLeadMutation();
  const [addStage] = useAddStageMutation();
  const [updateStage] = useUpdateStageMutation();
  const [updateStagePositions] = useUpdateStagePositionsMutation();
  const [deleteStage] = useDeleteStageMutation();
  const [deleteLead] = useDeleteLeadMutation();

  const [stages, setStages] = useState([]);
  const [leads, setLeads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(null);
  const [deletedLeadIds, setDeletedLeadIds] = useState([]);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (leadsResponse?.data) setLeads(leadsResponse.data);
    if (stagesData?.data) {
      const stagesArray = Array.isArray(stagesData.data) ? stagesData.data : [];
      const sortedStages = [...stagesArray].sort(
        (a, b) => a.position - b.position
      );
      setStages(sortedStages);
    }
  }, [leadsResponse, stagesData]);

  const handleDeleteLead = async (leadId) => {
    const confirmDelete = confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;

    try {
      setDeletedLeadIds((prev) => [...prev, leadId]);
      const result = await deleteLead(leadId).unwrap();
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== leadId));

      toast.success(result.message || "Lead deleted successfully");
    } catch (error) {
      console.error("Delete lead error:", error);
      toast.error(error.data?.message || "Failed to delete lead");
      setDeletedLeadIds((prev) => prev.filter((id) => id !== leadId));
    }
  };

  const filteredLeads = leads.filter(
    (lead) => !deletedLeadIds.includes(lead._id)
  );

  const getLeadsForStage = (stageId) => {
    return (filteredLeads || []).filter((lead) => lead.stage === stageId);
  };

  const handleOpenStageDialog = (stage = null) => {
    setCurrentStage(stage);
    setIsStageDialogOpen(true);
  };

  const handleSaveStage = async (formData) => {
    try {
      if (formData.id) {
        // Update existing stage - let backend handle position reordering
        const result = await updateStage({
          id: formData.id,
          title: formData.title,
          position: formData.position,
        }).unwrap();
        toast.success("Stage updated successfully");
      } else {
        // Create new stage
        const result = await addStage({
          title: formData.title,
          position: formData.position,
        }).unwrap();
        toast.success("Stage created successfully");
      }
      refetchStages();
      setIsStageDialogOpen(false);
    } catch (error) {
      console.error("Save stage error:", error);
      toast.error(error.data?.message || "Failed to save stage");
    }
  };

  const handleDeleteStage = async (stageId) => {
    try {
      await deleteStage(stageId).unwrap();
      toast.success("Stage deleted successfully");
      refetchStages();
    } catch (error) {
      console.error("Delete stage error:", error);
      toast.error(error.data?.message || "Failed to delete stage");
    }
  };

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id.startsWith("stage-") && over.id.startsWith("stage-")) {
      const activeStageId = active.id.replace("stage-", "");
      const overStageId = over.id.replace("stage-", "");

      const oldIndex = stages.findIndex((s) => s._id === activeStageId);
      const newIndex = stages.findIndex((s) => s._id === overStageId);

      if (oldIndex !== newIndex) {
        const newStages = arrayMove(stages, oldIndex, newIndex);
        const updatedStages = newStages.map((stage, idx) => ({
          ...stage,
          position: idx,
        }));

        setStages(updatedStages);

        try {
          // Use the new bulk update endpoint
          await updateStagePositions(updatedStages).unwrap();
          toast.success("Stage positions updated");
        } catch (error) {
          console.error("Update stage positions error:", error);
          toast.error("Failed to update stage positions");
          // Revert to original stages on error
          setStages(stages);
        }
      }
      return;
    }

    if (active.id !== over.id) {
      const activeLead = leads.find((lead) => lead._id === active.id);
      const newStage = over.id.startsWith("stage-")
        ? stages.find((stage) => `stage-${stage._id}` === over.id)?.stageId
        : leads.find((lead) => lead._id === over.id)?.stage;

      if (activeLead && newStage && activeLead.stage !== newStage) {
        try {
          await updateLeadStage({
            id: active.id,
            stage: newStage,
            data: {},
            notes: `Moved from ${activeLead.stage} to ${newStage}`,
          }).unwrap();

          setLeads(
            leads.map((lead) =>
              lead._id === active.id ? { ...lead, stage: newStage } : lead
            )
          );
          toast.success("Lead stage updated");
        } catch (error) {
          console.error("Update lead stage error:", error);
          toast.error(error.data?.message || "Failed to update lead stage");
        }
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => setActiveId(null);

  const handleConvertLead = useCallback(
    async (leadId) => {
      try {
        const lead = leads.find((lead) => lead._id === leadId);
        if (!lead) {
          toast.error("Lead not found");
          return;
        }

        // Check if lead is in final stage
        const finalStage = stages.length > 0 ? stages[stages.length - 1] : null;
        const isFinalStage = finalStage && lead.stage === finalStage.stageId;

        if (!isFinalStage) {
          toast.error("Lead must be in the final stage before conversion");
          return;
        }

        const result = await convertLead(leadId).unwrap();
        toast.success(result.message || "Lead converted successfully");
        refetchLeads();
      } catch (error) {
        console.error("Convert lead error:", error);
        toast.error(error.data?.message || "Failed to convert lead");
      }
    },
    [convertLead, leads, refetchLeads, stages]
  );

  const convertRef = useRef(handleConvertLead);
  useEffect(() => {
    convertRef.current = handleConvertLead;
  }, [handleConvertLead]);

  if (isLoadingLeads || isLoadingStages) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    leadsError?.data?.message === "Insufficient module permissions" ||
    stagesError?.data?.message === "Insufficient module permissions"
  ) {
    return <PermissionError />;
  }

  return (
    <div className="space-y-6 p-4 pb-0 mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleOpenStageDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Manage Stages
          </Button>
          <Button onClick={() => setIsLeadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        </div>
      </div>
      <LeadFormDialog
        open={isLeadDialogOpen}
        onOpenChange={setIsLeadDialogOpen}
      />

      <NewStageDialog
        open={isStageDialogOpen}
        onOpenChange={setIsStageDialogOpen}
        stage={currentStage}
        stages={stages}
        onSave={handleSaveStage}
        onDelete={handleDeleteStage}
      />

      <div className="relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="overflow-x-auto">
            <div
              className="inline-flex min-w-full gap-4"
              style={{ minWidth: `${stages.length * 304}px` }}
            >
              <SortableContext
                items={stages.map((stage) => `stage-${stage._id}`)}
                strategy={horizontalListSortingStrategy}
              >
                {stages.map((stage) => (
                  <div
                    key={`stage-${stage._id}`}
                    className="flex-shrink-0 w-72 mb-[20px]"
                  >
                    <SortableStage
                      id={`stage-${stage._id}`}
                      title={stage.title}
                      count={getLeadsForStage(stage.stageId).length}
                      onEdit={() => handleOpenStageDialog(stage)}
                      isDefault={stage.isDefault}
                    >
                      <SortableContext
                        items={getLeadsForStage(stage.stageId).map(
                          (lead) => lead._id
                        )}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2 h-[calc(100vh-280px)] overflow-y-auto">
                          {getLeadsForStage(stage.stageId).map((lead) => (
                            <SortableItem key={lead._id} id={lead._id}>
                              <LeadCard
                                lead={lead}
                                handleConvertLead={handleConvertLead}
                                isConverting={isConverting}
                                onDeleteLead={handleDeleteLead}
                                stages={stages} // Pass stages to LeadCard
                              />
                            </SortableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </SortableStage>
                  </div>
                ))}
              </SortableContext>
            </div>
          </div>

          {typeof window !== "undefined" &&
            createPortal(
              <DragOverlay>
                {activeId ? (
                  activeId.startsWith("stage-") ? (
                    <StageOverlay
                      stage={stages.find(
                        (stage) => `stage-${stage._id}` === activeId
                      )}
                    />
                  ) : (
                    !deletedLeadIds.includes(activeId) && (
                      <LeadCard
                        lead={leads.find((lead) => lead._id === activeId)}
                        isDragging
                        handleConvertLead={(id) => convertRef.current(id)}
                        onDeleteLead={handleDeleteLead}
                        stages={stages} // Pass stages to LeadCard
                      />
                    )
                  )
                ) : null}
              </DragOverlay>,
              document.body
            )}
        </DndContext>
      </div>
    </div>
  );
}

function StageOverlay({ stage }) {
  return (
    <div className="p-4 border-2 border-blue-500 rounded-lg bg-white shadow-lg w-72 backdrop-blur-sm bg-opacity-90">
      <div className="font-medium text-lg text-blue-600">{stage?.title}</div>
      <div className="text-sm text-gray-500 mt-1">
        {stage?.position !== undefined ? `Position: ${stage.position}` : ""}
      </div>
    </div>
  );
}
