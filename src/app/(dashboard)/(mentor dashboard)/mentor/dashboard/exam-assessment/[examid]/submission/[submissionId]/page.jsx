import React from "react";
import EvaluateView from "./_components/EvaluateView";

const page = async ({ params }) => {
  const { examid, submissionId } = await params;
  return (
    <div>
      <EvaluateView examId={examid} submissionId={submissionId} />
    </div>
  );
};

export default page;
