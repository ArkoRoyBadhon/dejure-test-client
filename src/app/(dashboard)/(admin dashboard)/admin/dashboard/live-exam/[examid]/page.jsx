import React from "react";
import AdminExamDetailsPage from "./_components/AdminExamDetailPage";
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
