"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useEffect, useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetCourseByIdQuery } from "@/redux/features/course/course.api";

export default function EnrollmentFormDialog({
  open,
  onOpenChange,
  enrollment,
  learners = [],
  courses = [],
  onSubmit,
  isEdit = false,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    learner: "",
    course: "",
    selectedTypes: [],
    payment: {
      isPaid: true,
      paymentMethod: "bkash",
      paymentType: "one-time",
      paidAt: new Date().toISOString(),
    },
    totalPay: 0,
    paid: 0,
    due: 0,
    milestonePayments: [],
    note: "",
  });

  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedPayTerm, setSelectedPayTerm] = useState("one-time");
  const [daysForNextPayment, setDaysForNextPayment] = useState(10);
  const [editablePrices, setEditablePrices] = useState({});
  const [learnerSearch, setLearnerSearch] = useState("");
  const [adminDiscount, setAdminDiscount] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [editableMilestonePercentages, setEditableMilestonePercentages] =
    useState({});
  const [editableMilestoneAmounts, setEditableMilestoneAmounts] = useState({});

  // Get course details when course is selected
  const { data: course } = useGetCourseByIdQuery(formData.course, {
    skip: !formData.course,
  });

  // Calculate derived values
  const selectedType = useMemo(() => {
    return course?.types?.find((type) => type.mode === selectedMode) || null;
  }, [selectedMode, course]);

  const baseAmount = useMemo(() => {
    if (!selectedType) return 0;
    // Use editable price if available, otherwise use the course price
    const originalAmount =
      editablePrices[selectedMode] !== undefined
        ? editablePrices[selectedMode]
        : selectedType.salePrice || selectedType.price;

    // Apply admin discount if applied
    if (isDiscountApplied && adminDiscount && adminDiscount > 0) {
      return Math.round(originalAmount * (1 - Number(adminDiscount) / 100));
    }

    return originalAmount;
  }, [selectedType, editablePrices, isDiscountApplied, adminDiscount]);

  const firstMilestoneAmount = useMemo(() => {
    if (course?.milestones?.length > 0) {
      // Use editable amount if available, otherwise calculate from percentage
      if (editableMilestoneAmounts[0] !== undefined) {
        return editableMilestoneAmounts[0];
      }

      const firstMilestonePercentage =
        editableMilestonePercentages[0] !== undefined
          ? editableMilestonePercentages[0]
          : course.milestones[0].percentage;
      return Math.round(baseAmount * (firstMilestonePercentage / 100));
    }
    return 0;
  }, [
    baseAmount,
    course?.milestones,
    editableMilestonePercentages,
    editableMilestoneAmounts,
  ]);

  const due = useMemo(() => {
    return baseAmount - formData.paid;
  }, [baseAmount, formData.paid]);

  // Initialize form when enrollment is provided (edit mode)
  useEffect(() => {
    if (enrollment) {
      const initialData = {
        ...enrollment,
        learner: enrollment.learner._id || enrollment.learner,
        course: enrollment.course._id || enrollment.course,
        payment: {
          ...enrollment.payment,
          paidAt: enrollment.payment?.paidAt || new Date().toISOString(),
        },
      };

      setFormData(initialData);
      setSelectedPayTerm(initialData.payment?.paymentType || "one-time");

      // Set selected mode based on enrollment's selectedTypes
      if (enrollment.selectedTypes?.length > 0) {
        const mode = enrollment.selectedTypes[0].mode;
        setSelectedMode(mode);
        // Set editable price if it exists
        if (enrollment.selectedTypes[0].price) {
          setEditablePrices((prev) => ({
            ...prev,
            [mode]: enrollment.selectedTypes[0].price,
          }));
        }
      }

      // Set days for next payment if milestone exists
      if (
        enrollment.milestonePayments?.length > 0 &&
        enrollment.milestonePayments[0].nextPayDate
      ) {
        const nextPayDate = new Date(
          enrollment.milestonePayments[0].nextPayDate
        );
        const today = new Date();
        const diffTime = nextPayDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysForNextPayment(diffDays > 0 ? diffDays : 10);
      }

      // Handle admin discount if it exists in enrollment
      if (
        enrollment.adminDiscount !== undefined &&
        enrollment.adminDiscount > 0
      ) {
        setAdminDiscount(enrollment.adminDiscount.toString());
        setIsDiscountApplied(true);
      }

      // Handle editable milestone percentages if they exist
      if (enrollment.milestonePayments?.length > 0) {
        const milestonePercentages = {};
        enrollment.milestonePayments.forEach((milestone, index) => {
          if (milestone.percentage !== undefined) {
            milestonePercentages[index] = milestone.percentage;
          }
        });
        if (Object.keys(milestonePercentages).length > 0) {
          setEditableMilestonePercentages(milestonePercentages);
        }
      }
    } else {
      // Reset form for new enrollment
      setFormData({
        learner: "",
        course: "",
        selectedTypes: [],
        payment: {
          isPaid: true,
          paymentMethod: "bkash",
          paymentType: "one-time",
          paidAt: new Date().toISOString(),
        },
        totalPay: 0,
        paid: 0,
        due: 0,
        milestonePayments: [],
        note: "",
      });
      setSelectedMode(null);
      setSelectedPayTerm("one-time");
      setDaysForNextPayment(10);
      setEditablePrices({});
      setAdminDiscount("");
      setIsDiscountApplied(false);
      setEditableMilestonePercentages({});
    }
  }, [enrollment]);

  // Update derived values when course or selected type changes
  useEffect(() => {
    if (course && selectedType) {
      const newTotalPay = baseAmount;
      const newPaid =
        selectedPayTerm === "one-time" ? baseAmount : firstMilestoneAmount;

      setFormData((prev) => {
        // Calculate next pay date (today + daysForNextPayment days)
        const nextPayDate = new Date();
        nextPayDate.setDate(nextPayDate.getDate() + daysForNextPayment);

        return {
          ...prev,
          selectedTypes: [
            {
              mode: selectedType.mode,
              price: baseAmount, // Store the actual price used
              originalPrice: selectedType.price, // Keep original for reference
              salePrice: selectedType.salePrice, // Keep original sale price
            },
          ],
          totalPay: newTotalPay,
          paid: newPaid,
          due: newTotalPay - newPaid,
          milestonePayments:
            selectedPayTerm === "milestone"
              ? course?.milestones?.map((m, index) => {
                  const currentPercentage =
                    editableMilestonePercentages[index] !== undefined
                      ? editableMilestonePercentages[index]
                      : m.percentage;
                  const currentAmount =
                    editableMilestoneAmounts[index] !== undefined
                      ? editableMilestoneAmounts[index]
                      : Math.round(baseAmount * (currentPercentage / 100));
                  // Calculate nextPayDate for each milestone after the first one
                  const milestoneNextPayDate =
                    index > 0
                      ? (() => {
                          const milestoneDate = new Date();
                          milestoneDate.setDate(
                            milestoneDate.getDate() + daysForNextPayment * index
                          );
                          return milestoneDate.toISOString();
                        })()
                      : null;

                  return {
                    milestoneTitle: m.title || "Untitled",
                    percentage: currentPercentage,
                    isPaid: index === 0,
                    amount: currentAmount,
                    paidAt: index === 0 ? new Date().toISOString() : null,
                    nextPayDate: milestoneNextPayDate,
                  };
                })
              : [],
        };
      });
    }
  }, [
    course,
    selectedType,
    baseAmount,
    firstMilestoneAmount,
    selectedPayTerm,
    daysForNextPayment,
    editableMilestonePercentages,
    editableMilestoneAmounts,
  ]);

  // Update milestone amounts when baseAmount changes (due to discount changes)
  useEffect(() => {
    if (
      course?.milestones &&
      Object.keys(editableMilestoneAmounts).length > 0
    ) {
      // Recalculate milestone amounts based on new baseAmount
      const newAmounts = { ...editableMilestoneAmounts };
      const newPercentages = { ...editableMilestonePercentages };

      // Update amounts based on current percentages
      Object.keys(editableMilestoneAmounts).forEach((index) => {
        const indexNum = parseInt(index);
        const percentage =
          editableMilestonePercentages[indexNum] ||
          course.milestones[indexNum]?.percentage ||
          0;
        newAmounts[indexNum] = Math.round(baseAmount * (percentage / 100));
      });

      setEditableMilestoneAmounts(newAmounts);
    }
  }, [baseAmount, course?.milestones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  const handlePriceChange = (mode, price) => {
    setEditablePrices((prev) => ({
      ...prev,
      [mode]: Number(price),
    }));
  };

  const handleMilestoneAmountChange = (index, amount) => {
    const newAmount = Number(amount);
    if (isNaN(newAmount) || newAmount < 0) return;

    setEditableMilestoneAmounts((prev) => ({
      ...prev,
      [index]: newAmount,
    }));

    // Calculate percentage based on amount and current baseAmount
    const percentage = Math.round((newAmount / baseAmount) * 100);
    setEditableMilestonePercentages((prev) => ({
      ...prev,
      [index]: percentage,
    }));

    // Auto-adjust remaining milestones
    if (course?.milestones && course.milestones.length > 1) {
      const remainingAmount = baseAmount - newAmount;
      const remainingMilestones = course.milestones.slice(1);

      // Distribute remaining amount equally among remaining milestones
      const amountPerRemainingMilestone = Math.round(
        remainingAmount / remainingMilestones.length
      );

      const newAmounts = { ...editableMilestoneAmounts, [index]: newAmount };
      const newPercentages = {
        ...editableMilestonePercentages,
        [index]: percentage,
      };

      remainingMilestones.forEach((_, remainingIndex) => {
        const actualIndex = remainingIndex + 1;
        const adjustedAmount =
          remainingIndex === remainingMilestones.length - 1
            ? remainingAmount -
              amountPerRemainingMilestone * (remainingMilestones.length - 1)
            : amountPerRemainingMilestone;

        newAmounts[actualIndex] = adjustedAmount;
        newPercentages[actualIndex] = Math.round(
          (adjustedAmount / baseAmount) * 100
        );
      });

      setEditableMilestoneAmounts(newAmounts);
      setEditableMilestonePercentages(newPercentages);
    }
  };

  const resetForm = () => {
    setFormData({
      learner: "",
      course: "",
      selectedTypes: [],
      payment: {
        isPaid: true,
        paymentMethod: "bkash",
        paymentType: "one-time",
        paidAt: new Date().toISOString(),
      },
      totalPay: 0,
      paid: 0,
      due: 0,
      milestonePayments: [],
      note: "",
    });
    setSelectedMode(null);
    setSelectedPayTerm("one-time");
    setDaysForNextPayment(10);
    setEditablePrices({});
    setAdminDiscount("");
    setIsDiscountApplied(false);
    setEditableMilestonePercentages({});
    setEditableMilestoneAmounts({});
    setLearnerSearch("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedType) {
      alert("Please select a course mode");
      return;
    }

    const payload = {
      ...formData,
      payment: {
        ...formData.payment,
        paymentType: selectedPayTerm,
        isPaid: true,
      },
      adminDiscount:
        isDiscountApplied && adminDiscount ? Number(adminDiscount) : 0,
      editableMilestonePercentages:
        Object.keys(editableMilestonePercentages).length > 0
          ? editableMilestonePercentages
          : null,
      editableMilestoneAmounts:
        Object.keys(editableMilestoneAmounts).length > 0
          ? editableMilestoneAmounts
          : null,
    };

    onSubmit(payload);

    // Reset form after successful submission (only for new enrollments)
    if (!isEdit) {
      resetForm();
    }

    onOpenChange(false);
  };
  const filteredLearners = useMemo(() => {
    return learners?.filter((learner) =>
      learner.fullName.toLowerCase().includes(learnerSearch.toLowerCase())
    );
  }, [learnerSearch, learners]);

  if (!open) return null;

  const handleDialogClose = (open) => {
    if (!open && !isEdit) {
      // Reset form when closing dialog for new enrollments
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-25" />
      <DialogContent className="fixed left-[50%] top-[50%] custom-dialog-width2 translate-x-[-50%] translate-y-[-50%] overflow-auto max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-center font-medium leading-6 text-gray-900">
            {isEdit ? "Update Enrollment" : "Create New Enrollment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Learner and Course Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full">
              <Label htmlFor="learner">Learner</Label>
              <Select
                value={formData.learner}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, learner: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a learner" />
                </SelectTrigger>
                <SelectContent>
                  {/* Search input inside dropdown */}
                  <div className="px-2 py-1">
                    <Input
                      type="text"
                      placeholder="Search learner by name"
                      value={learnerSearch}
                      onChange={(e) => setLearnerSearch(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Filtered list */}
                  {filteredLearners.length > 0 ? (
                    filteredLearners.map((learner) => (
                      <SelectItem key={learner._id} value={learner._id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${learner.image}`}
                            className="w-8 h-8 rounded object-cover"
                            alt=""
                          />
                          {learner.fullName}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                      No learner found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label htmlFor="course">Course</Label>
              <Select
                value={formData.course}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, course: value }))
                }
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      <div className="flex items-center gap-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
                          alt={course.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span>
                          {course.title} (Batch: {course.batchNo})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <h3 className="font-medium mb-3">Payment Method:</h3>
          <RadioGroup
            value={formData.payment.paymentMethod}
            onValueChange={(value) => {
              const isFree = value === "free";
              setFormData((prev) => ({
                ...prev,
                payment: { ...prev.payment, paymentMethod: value },
                totalPay: isFree ? 0 : prev.totalPay,
                paid: isFree ? 0 : prev.paid,
                due: isFree ? 0 : prev.due,
                milestonePayments: isFree ? [] : prev.milestonePayments,
              }));
            }}
            className="grid grid-cols-2 gap-3"
          >
            {/* Cash Method */}
            <div className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg transition-colors">
              <RadioGroupItem value="cash" id="cash" />
              <label htmlFor="cash" className="cursor-pointer">
                <img
                  src="/payment-methods/cash.png"
                  alt="Cash"
                  className="w-[50px]"
                />
              </label>
            </div>

            {/* Free Method */}
            <div className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg transition-colors">
              <RadioGroupItem value="free" id="free" />
              <label htmlFor="free" className="cursor-pointer">
                <img
                  src="/payment-methods/free.png"
                  alt="Free"
                  className="w-[50px]"
                />
              </label>
            </div>
          </RadioGroup>

          {/* Course Type Selection */}
          {course && (
            <div className="bg-white shadow-md overflow-hidden border border-gray-200 rounded-md p-4">
              <div className="flex p-2 m-2  gap-6 items-center rounded-md border border-yellow-200 bg-yellow-50">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
                  alt="thumbnail"
                  className="rounded-lg w-[70px] h-[70px]"
                />
                <div>
                  <h1 className="text-md font-bold">{course.title}</h1>
                </div>
              </div>

              {formData.payment.paymentMethod !== "free" && (
                <div className="mt-4">
                  <Label>Select Course Mode</Label>
                  <RadioGroup
                    value={selectedMode}
                    onValueChange={handleModeChange}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                  >
                    {course.types?.map((type) => (
                      <div
                        key={type._id}
                        className={`flex flex-col p-4 border rounded-lg ${
                          selectedMode === type.mode
                            ? "border-primary bg-yellow-50"
                            : "border-yellow-300 hover:border-yellow-500"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem
                            value={type.mode}
                            id={`mode-${type.mode}`}
                            className="h-5 w-5"
                          />
                          <label
                            htmlFor={`mode-${type.mode}`}
                            className="cursor-pointer flex-1"
                          >
                            <div className="font-medium capitalize">
                              {type.mode}
                            </div>
                          </label>
                        </div>

                        <div className="mt-2">
                          <Label htmlFor={`price-${type.mode}`}>
                            Price (৳)
                          </Label>
                          <Input
                            id={`price-${type.mode}`}
                            type="number"
                            value={
                              isDiscountApplied &&
                              adminDiscount &&
                              adminDiscount > 0
                                ? Math.round(
                                    (editablePrices[type.mode] !== undefined
                                      ? editablePrices[type.mode]
                                      : type.salePrice || type.price) *
                                      (1 - Number(adminDiscount) / 100)
                                  )
                                : editablePrices[type.mode] !== undefined
                                ? editablePrices[type.mode]
                                : type.salePrice || type.price
                            }
                            onChange={(e) =>
                              handlePriceChange(type.mode, e.target.value)
                            }
                            className="mt-1"
                            readOnly={true}
                            style={{
                              backgroundColor: "#f3f4f6",
                              cursor: "not-allowed",
                            }}
                          />
                          {(type.salePrice || type.price) && (
                            <div className="text-xs text-gray-500 mt-1">
                              <p>
                                Original: ৳{type.price}{" "}
                                {type.salePrice &&
                                  type.salePrice !== type.price && (
                                    <span className="line-through">
                                      ৳{type.salePrice}
                                    </span>
                                  )}
                              </p>
                              {isDiscountApplied &&
                                adminDiscount &&
                                adminDiscount > 0 && (
                                  <p className="text-green-600 font-medium">
                                    After {adminDiscount}% discount: ৳
                                    {Math.round(
                                      (editablePrices[type.mode] !== undefined
                                        ? editablePrices[type.mode]
                                        : type.salePrice || type.price) *
                                        (1 - Number(adminDiscount) / 100)
                                    )}
                                  </p>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Admin Discount Section */}
              {selectedMode && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="adminDiscount">Admin Discount (%)</Label>
                      <Input
                        id="adminDiscount"
                        type="number"
                        min="0"
                        max="100"
                        value={adminDiscount}
                        onChange={(e) =>
                          setAdminDiscount(Number(e.target.value))
                        }
                        placeholder="Enter discount percentage (1-100%)"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          const discountValue = Number(adminDiscount);
                          if (discountValue > 0 && discountValue <= 100) {
                            setIsDiscountApplied(true);
                          } else {
                            alert(
                              "Please enter a valid discount percentage between 1-100%"
                            );
                          }
                        }}
                        disabled={
                          isDiscountApplied ||
                          !adminDiscount ||
                          Number(adminDiscount) <= 0 ||
                          Number(adminDiscount) > 100
                        }
                      >
                        Apply Discount
                      </Button>
                      {isDiscountApplied && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDiscountApplied(false);
                            setAdminDiscount("");
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  {isDiscountApplied && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ {adminDiscount}% discount applied. All amounts have been
                      reduced.
                      {isEdit && (
                        <span className="ml-2 text-blue-600">
                          (Existing discount from enrollment)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Payment Term Selection */}
          {formData.payment.paymentMethod !== "free" &&
            course?.payTerm?.length > 1 && (
              <div className="bg-white shadow-md overflow-hidden border border-yellow-300 rounded-md p-6 ">
                <RadioGroup
                  value={selectedPayTerm}
                  onValueChange={(value) => {
                    setSelectedPayTerm(value);
                    const newPaid =
                      value === "one-time" ? baseAmount : firstMilestoneAmount;
                    setFormData((prev) => ({
                      ...prev,
                      paid: newPaid,
                      due: baseAmount - newPaid,
                    }));
                  }}
                  className="space-y-2"
                >
                  {course.payTerm.includes("one-time") && (
                    <div className="flex items-center space-x-3 p-1 hover:bg-yellow-100 rounded-lg transition-colors">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <label
                        htmlFor="one-time"
                        className="cursor-pointer flex-1"
                      >
                        <div className="font-medium">এককালীন পেমেন্ট</div>
                        <p className="text-sm text-gray-600 mt-1">
                          সম্পূর্ণ কোর্স ফি একবারে পরিশোধ করুন
                        </p>
                      </label>
                    </div>
                  )}
                  {course.payTerm.includes("milestone") && (
                    <div className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg transition-colors">
                      <RadioGroupItem value="milestone" id="milestone" />
                      <label
                        htmlFor="milestone"
                        className="cursor-pointer flex-1"
                      >
                        <div className="font-medium">
                          মাইলস্টোন ভিত্তিক ({course.milestones?.length || 0}{" "}
                          কিস্তি)
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          কোর্সের বিভিন্ন পর্যায়ে পেমেন্ট করুন
                        </p>
                      </label>
                    </div>
                  )}
                </RadioGroup>
              </div>
            )}

          {/* Milestone Payment Details */}
          {formData.payment.paymentMethod !== "free" &&
            selectedPayTerm === "milestone" &&
            course?.milestones && (
              <div className="bg-white rounded-md shadow-md overflow-hidden border border-yellow-300 p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="daysForNextPayment">
                      Days until next payment:
                    </Label>
                    <Input
                      id="daysForNextPayment"
                      type="number"
                      value={daysForNextPayment}
                      onChange={(e) =>
                        setDaysForNextPayment(Number(e.target.value))
                      }
                      className="w-20 border rounded-md"
                      min="1"
                    />
                  </div>

                  {course.milestones.map((milestone, index) => {
                    const currentPercentage =
                      editableMilestonePercentages[index] !== undefined
                        ? editableMilestonePercentages[index]
                        : milestone.percentage;
                    const currentAmount =
                      editableMilestoneAmounts[index] !== undefined
                        ? editableMilestoneAmounts[index]
                        : Math.round(baseAmount * (currentPercentage / 100));

                    return (
                      <div
                        key={milestone._id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            <span className="text-primary">
                              মাইলস্টোন {index + 1}:
                            </span>{" "}
                            {milestone.title || "Untitled"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Label
                              htmlFor={`milestone-amount-${index}`}
                              className="text-sm"
                            >
                              Amount (৳):
                            </Label>
                            <Input
                              id={`milestone-amount-${index}`}
                              type="number"
                              min="0"
                              value={currentAmount}
                              onChange={(e) =>
                                handleMilestoneAmountChange(
                                  index,
                                  e.target.value
                                )
                              }
                              className="w-24 h-8 text-sm"
                              placeholder="Enter amount"
                            />
                            <span className="text-sm text-gray-600">
                              ({currentPercentage}% of total)
                              {isEdit &&
                                (editableMilestonePercentages[index] !==
                                  undefined ||
                                  editableMilestoneAmounts[index] !==
                                    undefined) && (
                                  <span className="ml-1 text-blue-600 text-xs">
                                    (Modified)
                                  </span>
                                )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Payment Information */}
          <div className="bg-white shadow-md overflow-hidden border border-gray-200 rounded-md p-6 space-y-4">
            {/* Payment Summary */}
            {formData.payment.paymentMethod !== "free" && (
              <div className="mt-6 space-y-3 border-t pt-4">
                {selectedPayTerm === "one-time" ? (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-green-600 font-bold">
                      ৳{baseAmount}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-blue-600 font-bold">
                        ৳{baseAmount}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">First Installment:</span>
                      <span className="text-green-600 font-bold">
                        ৳{firstMilestoneAmount}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Due Amount:</span>
                      <span className="text-red-600 font-bold">৳{due}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Payment Term:</span>
                  <span className="capitalize">
                    {selectedPayTerm === "milestone"
                      ? `Milestone (${
                          course?.milestones?.length || 0
                        } installments)`
                      : "One-time Payment"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="note">Notes</Label>
            <Textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!isEdit) {
                  resetForm();
                }
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Enrollment"
                : "Create Enrollment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
