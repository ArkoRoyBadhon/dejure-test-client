"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMakeDuePaymentMutation } from "@/redux/features/enroll/enroll.api";
import { useState } from "react";
import { toast } from "sonner";

export function MakeDuePaymentDialog({ open, onClose, enrollment }) {
  const [amount, setAmount] = useState(enrollment?.due || 0);
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [makeDuePayment, { isLoading }] = useMakeDuePaymentMutation();

  const handleSubmit = async () => {
    try {
      await makeDuePayment({
        id: enrollment._id,
        milestoneTitle:
          enrollment?.milestonePayments?.find((m) => !m.isPaid)
            ?.milestoneTitle || "Installment",
        amount: Number(amount),
        method,
        note,
        paidAt: new Date(),
      }).unwrap();

      toast.success("পেমেন্ট সফল হয়েছে!");
      onClose();
    } catch (error) {
      toast.error("পেমেন্ট ব্যর্থ হয়েছে!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-800">
            মাইলস্টোন পেমেন্ট
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="block font-medium">পেমেন্ট এমাউন্ট (৳)</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded-md"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled
            />
          </div>

          <div>
            <label className="block font-medium">পেমেন্ট পদ্ধতি</label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="bkash">Bkash</option>
              <option value="nagad">Nagad</option>
              <option value="rocket">Rocket</option>
              <option value="card">Card</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">নোট (ঐচ্ছিক)</label>
            <textarea
              rows={3}
              className="w-full border px-3 py-2 rounded-md"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-[#FFB800] hover:bg-yellow-500 text-white font-bold py-2 rounded-md"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "পেমেন্ট হচ্ছে..." : "পেমেন্ট কনফার্ম করুন"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
