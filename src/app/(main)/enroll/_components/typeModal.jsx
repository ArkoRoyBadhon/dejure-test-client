"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ShoppingCart,
  BadgePercent,
  ArrowUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import LearnerLoginComponent from "@/app/(auth)/login/_components/LearnerLoginComponent";

export default function TypeModal({
  courseTypes,
  onSelectType,
  onClose,
  course,
}) {
  const [selectedType, setSelectedType] = useState(null);
  const [open, setOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loginClick, setLoginClick] = useState(false);

  const learner = useSelector((state) => state.auth?.user);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // modal বন্ধ হলে parent-এ জানিয়ে দিই
  useEffect(() => {
    if (!open) onClose?.();
  }, [open, onClose]);

  const isFree = course?.paymentType?.toLowerCase() === "free";
  // const hasTypes = Array.isArray(courseTypes) && courseTypes.length > 0;

  const handleLoginSuccess = () => {
    setLoginClick(false);
    // After successful login, proceed with the original flow
    if (isFree) {
      setOpen(false);
      onSelectType?.(null);
      return;
    }
    if (selectedType) {
      setOpen(false);
      onSelectType?.(selectedType);
    }
  };

  const handleConfirm = () => {
    // Check if user is logged in
    // if (!learner) {
    //   setLoginClick(true);
    //   return;
    // }

    if (isFree) {
      setOpen(false);
      onSelectType?.(null);
      return;
    }
    if (selectedType) {
      setOpen(false);
      onSelectType?.(selectedType);
    } else {
      toast.warning("Please select a course type to proceed.", {
        icon: <AlertCircle className="text-yellow-500" />,
      });
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* DialogContent এর ভিতরে একটাই child: এই <div> */}
        <DialogContent className="custom-dialog-width2 max-w-md sm:max-w-lg md:max-w-xl overflow-hidden p-0 border-0">
          <div className="bg-white rounded-lg shadow-lg border border-yellow-200 overflow-hidden">
            {/* Course Header */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-yellow-300 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <div className="p-1 mx-auto sm:mx-0 bg-white rounded-lg shadow-sm border border-yellow-200">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${
                    course?.thumbnail ?? ""
                  }`}
                  alt={course?.title ?? "Course"}
                  className="rounded-md w-[60px] h-[60px] object-cover"
                />
              </div>
              <div className="flex flex-col justify-center text-center sm:text-left">
                <h1 className="text-base sm:text-lg font-bold text-yellow-900">
                  {course?.title ?? "Course"}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <BookOpen className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Course Selection
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold text-yellow-800 flex items-center justify-center gap-2">
                  <ArrowUp className="w-5 h-5 text-yellow-600 animate-bounce" />
                  {isFree
                    ? "No payment needed – It's Free!"
                    : "কোর্স টাইপ নির্বাচন করুন"}
                  <ArrowUp className="w-5 h-5 text-yellow-600 animate-bounce" />
                </DialogTitle>
              </DialogHeader>

              {isFree ? (
                <div className="text-center text-green-700 font-semibold text-lg my-6">
                  🎉 This course is completely free! No payment required.
                </div>
              ) : (
                <RadioGroup
                  value={selectedType ? selectedType._id : ""}
                  onValueChange={(value) => {
                    const type = courseTypes.find((t) => t._id === value);
                    setSelectedType(type);
                  }}
                  className="space-y-4 mb-6 mt-6 flex flex-col justify-center"
                >
                  {courseTypes?.map((type) => (
                    <div
                      key={type._id}
                      className={`flex items-center space-x-3 p-4 border rounded-lg transition-all cursor-pointer justify-center ${
                        selectedType?._id === type._id
                          ? "bg-yellow-100 border-yellow-400 shadow-md"
                          : "border-yellow-200 hover:bg-yellow-50"
                      }`}
                    >
                      <RadioGroupItem
                        value={type._id}
                        id={type._id}
                        className={`mt-1 ${
                          selectedType?._id === type._id
                            ? "text-yellow-600 border-yellow-600"
                            : "border-yellow-400"
                        }`}
                      />
                      <label
                        htmlFor={type._id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-md text-yellow-900">
                            {type.mode}
                          </div>
                          <div className="flex items-center mt-1">
                            {type.salePrice && type.salePrice !== type.price ? (
                              <div className="flex items-center">
                                <span className="line-through text-red-500 mr-2 text-sm hidden md:block">
                                  ৳{type.price}
                                </span>
                                <BadgePercent className="w-4 h-4 text-yellow-600 mr-1" />
                                <span className="text-green-700 font-bold text-lg">
                                  ৳{type.salePrice}
                                </span>
                              </div>
                            ) : (
                              <span className="text-green-700 font-bold text-lg">
                                ৳{type.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              <button
                onClick={handleConfirm}
                className={`w-full py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isFree
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : selectedType
                    ? "bg-yellow-400 hover:bg-yellow-600 text-white shadow-md"
                    : "bg-yellow-200 text-yellow-800 cursor-not-allowed"
                }`}
              >
                {isFree ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Enroll for Free
                  </>
                ) : selectedType ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    এনরোল করুন
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    একটি অপশন নির্বাচন করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      {loginClick && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ease-in-out opacity-0 animate-fade-in"
            onClick={() => setLoginClick(false)}
          />
          <div className="fixed inset-0 flex justify-center items-center z-[999]">
            <div className="animate-grow origin-center">
              <LearnerLoginComponent
                setLoginClick={setLoginClick}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
