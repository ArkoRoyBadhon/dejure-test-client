"use client";
import { useSelector } from "react-redux";
import { PaymentHistoryModal } from "../_components/PaymentHistoryModal";
import {
  useGetDueEnrollmentBylearnerQuery,
  useGetEnrollmentsByUserQuery,
} from "@/redux/features/enroll/enroll.api";
import { useState } from "react";
import { MakeDuePaymentDialog } from "./MakeDuePaymentDialog";
import dynamic from "next/dynamic";
import Loader from "@/components/shared/Loader";

// Dynamic imports to avoid ES Module issues during build
// const PDFDownloadLink = dynamic(
//   () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
//   { ssr: false }
// );

// const InvoicePDF = dynamic(() => import("./_components/InvoicePDF"), {
//   ssr: false,
// });

export default function PaymentHistoryPage() {
  const learner = useSelector((state) => state.auth?.user?._id);
  const {
    data: enrollments,
    isLoading,
    isError,
  } = useGetEnrollmentsByUserQuery(learner, {
    skip: !learner,
  });
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedEnrollment(null);
    setDialogOpen(false);
  };

  const { data: dueEnrollments } = useGetDueEnrollmentBylearnerQuery(learner);

  if (isLoading) {
    return <Loader text="Loading payment history..." />;
  }

  if (isError) {
    return <p>Error loading payment history. Please try again.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex border px-2 py-4 gap-2 rounded-t-xl bg-[#F2F7FC]">
        <div className="flex items-center justify-center gap-2 ml-4">
          <img src="/payment.svg" alt="resource Logo" />
          <p className="font-bold">পেমেন্ট এবং অর্ডার</p>
        </div>
      </div>

      <div className="bg-white rounded-b-lg  p-6 mb-4">
        {/* Part  - 1,Payments & Order */}
        <div className="">
          <div className="grid grid-cols-1 space-y-4">
            {dueEnrollments?.data?.map((enrollment) => {
              const secondMilestone = enrollment.milestonePayments?.[1];
              let daysLeft = null;
              let formattedDate = null;

              if (secondMilestone?.nextPayDate) {
                const now = new Date();
                const nextPayDate = new Date(secondMilestone.nextPayDate);

                const timeDiff = nextPayDate.getTime() - now.getTime();
                daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days

                // Format date to MM-DD-YY (e.g., 08-05-25)
                const day = nextPayDate.getDate().toString().padStart(2, "0");
                const month = (nextPayDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const year = nextPayDate.getFullYear().toString().slice(2);
                formattedDate = `${month}-${day}-${year}`;
              }

              return (
                <div
                  key={enrollment._id}
                  className="mb-4 border-2 p-2 rounded-lg bg-[#FFB8000D] border-[#FFB800]"
                >
                  <div className="flex items-center justify-center">
                    {/* Course Info */}
                    <div className="flex-[4] p-2 rounded-xl border border-gray-200 bg-white flex items-center gap-2">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${enrollment.course.thumbnail}`}
                        alt=""
                        className="w-16 h-16 rounded-lg"
                      />
                      <p className="font-bold">{enrollment.course.title}</p>
                    </div>

                    {/* Payment Info */}
                    {daysLeft !== null && (
                      <div className="flex-[8] flex flex-col items-center font-bold space-y-2">
                        <h1 className="text-xl">
                          পরবর্তী ইনস্টলমেন্ট প্রধান এর সময় বাকি{" "}
                          <span className="text-2xl text-yellow-500">
                            {daysLeft}
                          </span>{" "}
                          দিন
                        </h1>
                        <p className="text-[#74767C] text-[14px]">
                          পরবর্তী ইনস্টলমেন্ট এর তারিখ{" "}
                          <span className="text-black text-md">
                            {formattedDate}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Pay Button */}
                    <div className="flex-[4] flex items-center justify-center">
                      <button
                        onClick={() => openDialog(enrollment)}
                        className="w-[240px] py-2 bg-[#FFB800] hover:bg-amber-400 rounded-xl font-bold"
                      >
                        পে করুন
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part - 2, Course Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments?.map((enroll) => {
            const secondMilestone = enroll.milestonePayments?.[1];
            let formattedDate = null;

            if (secondMilestone?.nextPayDate) {
              const nextPayDate = new Date(secondMilestone.nextPayDate);
              const day = nextPayDate.getDate().toString().padStart(2, "0");
              const month = (nextPayDate.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const year = nextPayDate.getFullYear().toString().slice(2);
              formattedDate = `${month}-${day}-${year}`;
            }

            return (
              <div key={enroll._id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden my-4 flex border p-4 gap-6">
                  {/* Thumbnail */}
                  <div className="w-1/2  flex  items-center ">
                    {enroll.course?.thumbnail && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${enroll.course.thumbnail}`}
                        alt="Course Thumbnail"
                        className="rounded-lg object-cover "
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="w-1/2  relative min-h-[280px] py-2 pr-2">
                    <h2 className="text-[20px] font-semibold text-gray-800 mb-4">
                      {enroll.course?.title || "কোর্স টাইটেল"}
                    </h2>

                    <div className="space-y-2 mb-1 font-bold">
                      <div className="flex justify-between items-center">
                        <span className="text-[#74767C] ">
                          পেএবল অ্যামাউন্ট
                        </span>
                        <span className="text-gray-900 font-medium">
                          ৳ {enroll.totalPay}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#74767C]">পেইড অ্যামাউন্ট</span>
                        <span className="text-gray-900 font-medium">
                          ৳ {enroll.paid}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#74767C] ">অ্যামাউন্ট বাকি</span>
                        <span className="text-red-500 font-bold">
                          ৳ {enroll.due}
                        </span>
                      </div>

                      {enroll.due > 0 && formattedDate && (
                        <div className="flex justify-between items-center bg-[#FFB80033] px-3 py-1 rounded-xl">
                          <span className="text-[#74767C] text-sm">
                            পরবর্তী ইনস্টলমেন্ট
                          </span>
                          <span className="text-red-500 font-bold">
                            {formattedDate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Button */}
                    <div className="absolute bottom-2 left-0 right-1">
                      <PaymentHistoryModal
                        enroll={enroll}
                        enrollmentId={enroll._id}
                      >
                        <button className="w-full font-bold bg-[#FFB800] py-3 px-4 rounded-2xl hover:bg-yellow-400">
                          ট্রান্সেকশন
                        </button>
                      </PaymentHistoryModal>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part - 3, Order History */}
      <div>
        <div className="flex border px-2 py-4 gap-2 rounded-t-xl bg-[#F2F7FC]">
          <div className="flex items-center justify-center gap-2 ml-4">
            <img src="/history.svg" alt="resource Logo" />
            <p className="font-bold">অর্ডার হিস্ট্রি</p>
          </div>
        </div>
        <div className="bg-white rounded-b-lg p-6 mb-4">
          <div className="grid grid-cols-1 gap-4">
            {enrollments?.map((enroll) => (
              <div
                key={enroll._id}
                className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex flex-wrap md:flex-nowrap"
              >
                <div className="flex flex-7  gap-4">
                  {/* 1. Image + Title (Flex) */}
                  <div className="flex flex-5 items-center justify-center gap-4 w-full md:w-auto border border-yellow-500  bg-yellow-50 p-4 rounded-xl">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-md bg-gray-100 flex-shrink-0 border">
                      {enroll.course?.thumbnail ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${enroll.course.thumbnail}`}
                          alt="Course Thumbnail"
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Image
                        </span>
                      )}
                    </div>

                    {/* Title (Only visible on small screens if needed) */}
                    <h3 className="text-md font-bold text-gray-800 ">
                      {enroll.course?.title || "কোর্স টাইটেল"}
                    </h3>
                  </div>

                  {/* 2. Course Details (Flex) */}
                  <div className="flex-7 space-y-2 flex flex-col  justify-center ">
                    <p className="text-sm text-[#74767C]  flex justify-between">
                      <span className="font-semibold">সময়:</span>{" "}
                      <span className="text-black font-bold">
                        {enroll.createdAt
                          ? new Date(enroll.createdAt).toLocaleString("bn-BD", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </span>
                    </p>

                    <p className="text-sm text-[#74767C]  flex justify-between">
                      <span className="font-semibold">অবস্থা:</span>{" "}
                      {/* <span
                        className={`ml-2 px-2.5 py-0.5 rounded-full text-black font-medium ${
                          enroll.status === "pending"
                            ? "bg-yellow-100 "
                            : enroll.status === "success"
                            ? "bg-green-100 "
                            : "bg-gray-100 "
                        }`}
                      >
                        {enroll.status || "unknown"}
                      </span> */}
                      <span className="ml-2 bg-[#0BCD8233] text-black  font-medium px-2.5 py-0.5 rounded-full">
                        SUCCESS
                      </span>
                    </p>

                    <p className="text-sm text-[#74767C] flex justify-between">
                      <span className="font-semibold">ধরণ:</span>{" "}
                      <span className="ml-2 bg-[#FFB80033] text-black  font-medium px-2.5 py-0.5 rounded-full">
                        COURSE
                      </span>
                    </p>
                    <p className="text-sm text-[#74767C] flex justify-between">
                      <span className="font-semibold">ডেলিভারি স্টেটাস:</span>{" "}
                      <span className="ml-2 bg-[#0BCD8233] text-black  font-medium px-2.5 py-0.5 rounded-full">
                        DELIVERED
                      </span>
                    </p>
                  </div>
                </div>

                {/* 3. Payment Info + Button (Flex) */}
                {/* <div className="flex flex-col items-end justify-top gap-2 w-full md:w-auto flex-5">
                  <p className="text-lg font-bold text-gray-900">
                    এমাউন্ট: ৳{enroll.paid}
                  </p>
                  <PDFDownloadLink
                    document={<InvoicePDF enrollment={enroll} />}
                    fileName={`invoice_${enroll._id}.pdf`}
                  >
                    {({ loading }) => (
                      <button className="flex items-center px-3 py-2 rounded-lg shadow-sm text-sm font-bold text-[#141B34] bg-[#0047FF33] hover:bg-blue-50 transition-colors gap-2">
                        <img
                          src="/downloadb.svg"
                          alt="Download"
                          className="w-4 h-4"
                        />
                        {loading ? "প্রস্তুত হচ্ছে..." : "ডাউনলোড ইনভয়েস"}
                      </button>
                    )}
                  </PDFDownloadLink>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedEnrollment && (
        <MakeDuePaymentDialog
          open={dialogOpen}
          onClose={closeDialog}
          enrollment={selectedEnrollment}
        />
      )}
    </div>
  );
}
