import React from "react";
import ExamController from "./_components/ExamController";

const page = async ({ params }) => {
  const { examid } = await params;
  return (
    <div>
      <ExamController examid={examid} />
    </div>
  );
};

export default page;
