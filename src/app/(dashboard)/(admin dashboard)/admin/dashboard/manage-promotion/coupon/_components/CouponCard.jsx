"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2, TicketPercent } from "lucide-react";
import { CreateCouponDialog } from "./CreateCouponDialog";
import { DeleteDialog } from "./DeleteCouponDialog";
import { CouponAnalytics } from "./CouponAnalytics";

function Line({ label, value }) {
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function CouponCard({ coupon }) {
  const isPercent = coupon?.discountType === "PERCENT";
  const value = isPercent
    ? `${coupon?.DiscountPercentage ?? 0}%`
    : `${coupon?.DiscountFixed ?? 0}`;
  const period =
    (coupon?.startDate
      ? new Date(coupon.startDate).toLocaleDateString()
      : "—") +
    " → " +
    (coupon?.endDate ? new Date(coupon.endDate).toLocaleDateString() : "—");

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TicketPercent className="w-5 h-5" />
          <div className="text-lg font-semibold tracking-wide">
            {coupon?.code}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              coupon?.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {coupon?.isActive ? "Active" : "Inactive"}
          </span>
          <span className="text-xs px-2 py-1 rounded-full border">
            {coupon?.audienceType || "ALL"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1">
        <Line label="Type" value={coupon?.discountType} />
        <Line label="Value" value={value} />
        <Line
          label="Used / Limit"
          value={
            (coupon?.usedCount ?? 0) +
            (typeof coupon?.usageLimit === "number" && coupon.usageLimit > 0
              ? ` / ${coupon.usageLimit}`
              : " / ∞")
          }
        />
        <Line
          label="Per Learner"
          value={
            typeof coupon?.perUserLimit === "number" && coupon.perUserLimit > 0
              ? coupon.perUserLimit
              : 1
          }
        />
        <Line label="Period" value={period} />
        {typeof coupon?.minOrderValue === "number" && (
          <Line label="Min Order" value={coupon.minOrderValue} />
        )}
        {coupon?.maxDiscount != null && coupon.maxDiscount > 0 && (
          <Line label="Max Discount" value={coupon.maxDiscount} />
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 ">
        <CouponAnalytics coupon={coupon} />
        <CreateCouponDialog coupon={coupon}>
          <Button variant="outline" size="sm">
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </CreateCouponDialog>
        <DeleteDialog coupon={coupon}>
          <Button variant="ghost" size="sm">
            <Trash2 className="w-4 h-4 mr-1 text-red-500" />
            Delete
          </Button>
        </DeleteDialog>
      </div>
    </div>
  );
}
