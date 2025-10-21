import React from "react";
import QuestionSubjectView from "./_components/SubjectView";

const page = async ({ params }) => {
  const { subject } = await params;

  return (
    <div>
      <QuestionSubjectView typeId={subject} />
    </div>
  );
};

export default page;
