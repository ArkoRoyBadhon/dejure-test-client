"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const StudentInfoCard = ({ submission }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Label>Name</Label>
          <p className="font-medium">
            {submission.student?.fullName || "Unknown Student"}
          </p>
        </div>
        <div>
          <Label>Submission Date</Label>
          <p className="text-sm">
            {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>
        {submission.isEvaluated && (
          <div>
            <Label>Evaluated By</Label>
            <p className="text-sm">
              {submission.evaluatedBy || "Unknown Evaluator"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentInfoCard;