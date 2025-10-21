import React from "react";
import QuestionSetUpdate from "../../_components/QuestionSetUpdate";

const page = async ({ params }) => {
  const { questionsetId } = await params;
  return (
    <div>
      <QuestionSetUpdate questionsetId={questionsetId} />
    </div>
  );
};

export default page;
