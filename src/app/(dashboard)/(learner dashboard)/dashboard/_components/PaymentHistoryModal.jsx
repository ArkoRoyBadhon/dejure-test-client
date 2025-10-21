"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetTransactionByEnrollIdQuery } from "@/redux/features/enroll/enroll.api";
import dynamic from "next/dynamic";
import Loader from "@/components/shared/Loader";

// Dynamic imports to avoid ES Module issues during build
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

const TransactionInvoicePDF = dynamic(
  () => import("../payments/_components/TransactionPDF"),
  {
    ssr: false,
  }
);

export function PaymentHistoryModal({ enroll, children }) {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useGetTransactionByEnrollIdQuery(enroll._id);

  // Format date to Bengali
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Intl.DateTimeFormat("bn-BD", options).format(date);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="custom-dialog-width3 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>পেমেন্ট হিস্ট্রি</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-100 p-6 font-inter rounded-lg">
          {/* Page Header */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            পেমেন্ট হিস্ট্রি &gt; {enroll.course.title}
          </h1>

          {/* Payment Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Payable Amount */}
            <div className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">পে-এবল অ্যামাউন্ট</p>
                <p className="text-xl font-bold text-gray-900">
                  ৳ {enroll.totalPay}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            {/* Card 2: Total Paid */}
            <div className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">টোটাল পেইড</p>
                <p className="text-xl font-bold text-gray-900">
                  ৳ {enroll.paid}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>

            {/* Card 3: Amount Due */}
            <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-gray-600 text-sm">পেমেন্ট বাকি</p>
                  <p className="text-xl font-bold text-gray-900">
                    ৳ {enroll.due}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Card 4: Payment Status */}
            <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-gray-600 text-sm">পেমেন্ট স্ট্যাটাস</p>
                  {enroll.totalPay - enroll.paid > 0 ? (
                    <p className="text-red-500 font-bold text-2xl">UNPAID</p>
                  ) : (
                    <p className="text-green-500 font-bold text-2xl">PAID</p>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v2M7 7h.01M7 11h.01M13 11h.01M17 11h.01M7 15h.01M13 15h.01M17 15h.01"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">শেষ তারিখ ২৯-০৩-২৫</p>
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-6 border-b border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">
                ট্রান্সেকশন হিস্ট্রি
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <Loader text="Loading transactions..." size="sm" />
              ) : isError ? (
                <p>Error loading transactions</p>
              ) : (
                transactions?.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                      {transaction.course.thumbnail ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${transaction.course.thumbnail}`}
                          alt={transaction.course.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">Image</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {transaction.course.title}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>সময় : {formatDate(transaction.paidAt)}</p>
                        <p className="flex items-center">
                          অবস্থা :
                          <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            success
                          </span>
                        </p>
                        <p className="flex items-center">
                          ধরণ :
                          <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {transaction.type}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        ৳ {transaction.amount}
                      </p>
                      <PDFDownloadLink
                        document={
                          <TransactionInvoicePDF transaction={transaction} />
                        }
                        fileName={`invoice_${enroll._id}.pdf`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {({ loading }) => (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            {loading ? "প্রস্তুত হচ্ছে..." : "ডাউনলোড ইনভয়েস"}
                          </>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
