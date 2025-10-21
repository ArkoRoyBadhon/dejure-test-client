import React from "react";
import AdminExamDetailMainPage from "./_components/AdminExamDetailMainPage";

const page = async ({ params }) => {
  const { examid } = await params;
  return (
    <div>
      <AdminExamDetailMainPage examid={examid} />
    </div>
  );
};

export default page;
