"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import MCQForm from "./MCQForm";
import WrittenForm from "./WrittenForm";

const AddQuestionModal = ({ subjectId, onQuestionAdded }) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleSuccess = () => {
    setOpen(false);
    setSelectedType(null);
    onQuestionAdded();
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) setSelectedType(null);
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 bg-main hover:bg-main/90">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[1000px] max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {selectedType ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                Add {selectedType === "mcq" ? "MCQ" : "Written"} Question
              </div>
            ) : (
              "Select Question Type"
            )}
          </DialogTitle>
        </DialogHeader>

        {!selectedType ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => setSelectedType("mcq")}
              className="p-6 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <h3 className="font-medium text-lg">MCQ Question</h3>
              <p className="text-gray-500 mt-2">Multiple choice questions</p>
            </button>
            <button
              onClick={() => setSelectedType("written")}
              className="p-6 border rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <h3 className="font-medium text-lg">Written Question</h3>
              <p className="text-gray-500 mt-2">Open-ended text responses</p>
            </button>
          </div>
        ) : (
          <div className="mt-4">
            {selectedType === "mcq" ? (
              <MCQForm subjectId={subjectId} onSuccess={handleSuccess} />
            ) : (
              <WrittenForm subjectId={subjectId} onSuccess={handleSuccess} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionModal;
