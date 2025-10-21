import React from "react";
import ModuleQuestionsView from "./_components/ModuleQuestionsView";

const page = async ({ params }) => {
  const { question } = await params;

  return (
    <div>
      <ModuleQuestionsView subjectId={question} />
    </div>
  );
};

export default page;
