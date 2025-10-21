"use client";

import { CreateCouponDialog } from "./_components/CreateCouponDialog";
import CouponCard from "./_components/CouponCard";
import { CouponRedemptionsTable } from "./_components/CouponRedemptionsTable";
import { useGetCouponsQuery } from "@/redux/features/coupon/coupon.api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/shared/Loader";
import PermissionError from "@/components/shared/PermissionError";

export default function CouponPage() {
  const { data: couponsRes, isLoading, error } = useGetCouponsQuery();
  const coupons = couponsRes?.data || [];

  if (error?.data?.message === "Insufficient module permissions") {
    return <PermissionError error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="rounded-xl shadow-md">
        {/* Page Header */}
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center ">
          <div className="flex items-center gap-2">
            <span className="text-[#141B34] font-bold text-xl">
              MANAGE COUPON
            </span>
          </div>
          <div>
            <CreateCouponDialog />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-4 bg-white rounded-b-xl">
          <Tabs defaultValue="coupons" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
            </TabsList>

            <TabsContent value="coupons" className="mt-6">
              {isLoading ? (
                <Loader text="Loading coupons..." className="py-8" />
              ) : coupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {coupons.map((coupon) => (
                    <CouponCard key={coupon._id} coupon={coupon} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No coupons found.</p>
              )}
            </TabsContent>

            <TabsContent value="redemptions" className="mt-6">
              <CouponRedemptionsTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
