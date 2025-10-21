import LeaderBoardComponent from "@/app/(dashboard)/(mentor dashboard)/mentor/dashboard/exam-assessment/[examid]/leaderboard/_components/LeaderBoardComponent";

const page = async ({ params }) => {
  const { examid } = await params;
  return (
    <div className="p-4">
      <LeaderBoardComponent examid={examid} />
    </div>
  );
};

export default page;
