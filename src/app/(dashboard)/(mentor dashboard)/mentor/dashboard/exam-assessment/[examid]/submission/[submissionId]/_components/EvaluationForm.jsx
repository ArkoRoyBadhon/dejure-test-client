"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import CommonBtn from "@/components/shared/CommonBtn";

const EvaluationForm = ({
  submission,
  isUpdating,
  updateError,
  updateSuccess,
  onSubmitEvaluation,
}) => {
  const [marks, setMarks] = useState(submission?.totalMarks?.toString() || "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [grade, setGrade] = useState(submission?.grade || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitEvaluation({
      totalMarks: Number(marks),
      feedback,
      grade,
    });
  };

  return (
    <div className="space-y-4">
      {updateError && (
        <Alert variant="destructive">
          <AlertDescription>
            {updateError?.data?.message || "Failed to update submission"}
          </AlertDescription>
        </Alert>
      )}

      {updateSuccess && (
        <Alert variant="success">
          <AlertDescription>
            Evaluation submitted successfully!
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="marks">Total Marks</Label>
        <Input
          id="marks"
          type="number"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Enter total marks"
          disabled={submission?.isEvaluated}
        />
      </div>

      <div>
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide detailed feedback..."
          rows={5}
          disabled={submission?.isEvaluated}
        />
      </div>

      {!submission?.isEvaluated && (
        <div className="flex gap-2 pt-4">
          <CommonBtn onClick={handleSubmit} disabled={!marks || isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Submit Evaluation"
            )}
          </CommonBtn>
        </div>
      )}
    </div>
  );
};

export default EvaluationForm;
