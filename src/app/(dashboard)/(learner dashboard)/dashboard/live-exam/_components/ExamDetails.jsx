"use client";

import QuestionPreview from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/live-exam/_components/QuestionPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetLiveExamByIdQuery } from "@/redux/features/liveexams/liveExam.Api";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ExamController from "../[examid]/_components/ExamController";
import { useSelector } from "react-redux";
import LeaderBoardComponent from "@/app/(dashboard)/(mentor dashboard)/mentor/dashboard/exam-assessment/[examid]/leaderboard/_components/LeaderBoardComponent";
import EvaluateView from "@/app/(dashboard)/(mentor dashboard)/mentor/dashboard/exam-assessment/[examid]/submission/[submissionId]/_components/EvaluateView";
import QuiestionSetComponent from "../[examid]/_components/QuestionSetComponent";

const ExamDetails = ({ id, isOpen, onClose }) => {
  const { data: examData, isLoading, isError } = useGetLiveExamByIdQuery(id);
  const [activeView, setActiveView] = useState("details"); // 'details', 'preview', 'results', 'rules'
  const user = useSelector((state) => state.auth.user);

  const handleClose = () => {
    setActiveView("details");
    onClose();
  };

  const examid = id;

  const filterSubmission = examData?.submissions?.filter((submission) => {
    return submission.student === user?._id;
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} className="shadow-none">
      <DialogContent className="min-w-[800px] overflow-y-auto max-h-[95vh] no-scrollbar bg-transparent shadow-none border-none p-0">
        {activeView === "preview" ? (
          // Question Preview View
          <div className="p-4 bg-white rounded-[16px]">
            <Button
              onClick={() => setActiveView("details")}
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="mr-2" />
              Go Back
            </Button>
            <ExamController examid={examid} show={true} />
            {/* <QuestionPreview
              examData={examData}
              timeDuration={examData?.duration}
            /> */}
          </div>
        ) : activeView === "results" ? (
          // Results View
          <div className="p-4 bg-white rounded-[16px]">
            <Button
              onClick={() => setActiveView("details")}
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="mr-2" />
              Go Back
            </Button>
            <div className="pb-6 px-6">
              <h3 className="text-2xl font-bold mb-6 text-center">
                আমার রেজাল্ট
              </h3>
              <div className="mt-6 text-center">
                <p className="text-lg font-medium">
                  মূল্যায়ন অবস্থা:{" "}
                  {examData?.submissions.find(
                    (sub) => sub.student === user?._id
                  )?.isEvaluated
                    ? "সম্পন্ন"
                    : "মুল্যায়ন চলছে"}
                </p>
                <p className="">
                  প্রাপ্ত নম্বর:
                  {examData?.submissions.find(
                    (sub) => sub.student === user?._id
                  )?.totalMarks || 0}
                </p>
              </div>
            </div>
            {examData.type === "WRITTEN" ? (
              <EvaluateView
                examId={examid}
                submissionId={filterSubmission[0]?._id}
                isStudent={true}
              />
            ) : (
              <QuiestionSetComponent examData={examData} />
            )}
          </div>
        ) : activeView === "rules" ? (
          // Rules View
          <div className="p-4 bg-white rounded-[16px]">
            <Button
              onClick={() => setActiveView("details")}
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="mr-2" />
              Go Back
            </Button>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6">লিডারবোর্ড দেখি</h3>
              <LeaderBoardComponent examid={examid} show={true} />
            </div>
          </div>
        ) : (
          // Original Exam Details View
          <>
            {/* Course Info Section */}
            <section
              aria-labelledby="course-info-title"
              className="mb-6 bg-white p-6 rounded-[16px]"
            >
              <h4 className="text-lg font-semibold text-gray-900 pb-2">
                বিস্তারিত তথ্য
              </h4>
              {/* Image */}
              {examData?.courses &&
                examData?.courses.map((course, idx) => {
                  return (
                    <>
                      <div className="flex flex-col md:flex-row gap-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300 shadow-sm">
                        <div
                          key={idx}
                          className="flex-shrink-0 w-[160px] h-[160px] rounded-lg overflow-hidden shadow-md"
                        >
                          <Image
                            src={
                              course.thumbnail
                                ? `${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`
                                : "/assets/fallImg.jpg"
                            }
                            alt="19th BJS Signature Course cover"
                            className="object-cover w-[160px] h-[160px]"
                            height={500}
                            width={500}
                          />
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-center">
                          <h3 className="text-[20px] font-bold text-darkColor leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-deepGray mt-1 mb-3 text-[14px]">
                            {examData?.questionSet?.name}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {/* <span className="inline-block bg-blue/20 text-darkColor text-[14px] font-medium px-3 py-1 rounded-full border select-none">
                              ব্যাচ ১৯
                            </span> */}
                            <span className="inline-block bg-main/20 text-darkColor text-[14px] font-medium px-3 py-1 rounded-full border select-none">
                              পরীক্ষামূলক কোর্স
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}

              {/* Text Content */}
            </section>

            {/* Live Exam Section */}
            <section
              aria-labelledby="live-exam-title"
              className="bg-white rounded-[16px] shadow-md border border-gray-200 overflow-hidden"
            >
              <div
                id="live-exam-title"
                className="text-[20px] font-bold text-darkColor flex items-center gap-4 bg-gray1 p-4"
              >
                <Image
                  src="/assets/icons/note-03.png"
                  alt="live-exam-icon"
                  width={24}
                  height={24}
                />
                <h4 className="">লাইভ এক্সাম</h4>
              </div>

              <div className="flex flex-col md:flex-row gap-6  p-6">
                {/* Live Class Card Left */}
                <article className="flex-1 rounded-lg p-6 border shadow-sm">
                  <header className="mb-4">
                    <h3 className="text-[20px] font-bold text-darkColor mb-2">
                      {examData?.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium">
                      <span className="bg-green/40 text-darkColor px-3 py-1 rounded-full select-none">
                        রেজাল্ট প্রকাশিত
                        {examData?.resultPublished ? " হয়েছে" : " হয়নি"}
                      </span>
                      {/* <span className="bg-red-/40 text-gray-600 px-3 py-1 rounded-full select-none line-through">
                        Ended
                      </span> */}
                    </div>
                  </header>
                  <dl className="text-[14px] space-y-1">
                    <div className="flex items-center">
                      <dt className="w-28 font-semibold">মডিউল</dt>
                      <dd className="flex-1 text-[12px]">
                        {examData?.courses[0]?.title}
                      </dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="w-28 font-semibold">সাবজেক্ট</dt>
                      <dd className="flex-1 text-[12px]">
                        {examData?.subject?.name}
                      </dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="w-28 font-semibold">শুরু</dt>
                      <dd className="flex-1 text-[12px]">
                        {examData?.scheduledDate} {examData?.scheduledTime}
                      </dd>
                    </div>

                    <div className="flex items-center">
                      <dt className="w-28 font-semibold">সময়</dt>
                      <dd className="flex-1 text-[12px]">
                        {examData?.durationMinutes} মিনিট
                      </dd>
                    </div>
                  </dl>
                </article>

                {/* Action Buttons Right */}
                <aside className="flex-1 space-y-4 bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setActiveView("preview")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] bg-gray1 transition focus:outline-none hover:outline"
                  >
                    <div className="flex items-center gap-3 text-[14px] font-bold">
                      <Image
                        src="/assets/icons/note-03.png"
                        alt="live-exam-icon"
                        width={18}
                        height={18}
                      />
                      প্রশ্ন পত্র দেখি
                    </div>
                    <ChevronRight size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView("results")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] bg-gray1 transition focus:outline-none hover:outline"
                  >
                    <div className="flex items-center gap-3 text-[14px] font-bold">
                      <Image
                        src="/assets/icons/note-03.png"
                        alt="live-exam-icon"
                        width={18}
                        height={18}
                      />
                      আমার রেজাল্ট
                    </div>
                    <ChevronRight size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView("rules")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] bg-gray1 transition focus:outline-none hover:outline"
                  >
                    <div className="flex items-center gap-3 text-[14px] font-bold">
                      <Image
                        src="/assets/icons/note-03.png"
                        alt="live-exam-icon"
                        width={18}
                        height={18}
                      />
                      লিডারবোর্ড দেখি
                    </div>
                    <ChevronRight size={20} />
                  </button>
                </aside>
              </div>
            </section>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExamDetails;
