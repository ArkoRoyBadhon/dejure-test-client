import React from "react";
import EditExamEditPage from "./_components/LiveExamEditPage";

const page = async ({ params }) => {
  const { examid } = await params;
  return (
    <div>
      <EditExamEditPage examid={examid} />
    </div>
  );
};

export default page;
