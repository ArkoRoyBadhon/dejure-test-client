"use client";

import { useState } from "react";
import { useGetCouponAnalyticsQuery } from "@/redux/features/coupon/coupon.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart3,
  Users,
  DollarSign,
  ShoppingCart,
  BookOpen,
  Calendar,
  Loader2,
} from "lucide-react";

export function CouponAnalytics({ coupon }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetCouponAnalyticsQuery(coupon._id, {
    skip: !isOpen,
  });

  const analytics = data?.data?.analytics;
  const redemptions = data?.data?.redemptions || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Coupon Analytics - {coupon.code}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading analytics...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading analytics
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Uses
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.totalRedemptions || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unique Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.uniqueUsers || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Discount
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    TK. {analytics?.totalDiscountGiven?.toFixed(2) || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usage Rate
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {coupon.usageLimit
                      ? `${Math.round(
                          ((analytics?.totalRedemptions || 0) /
                            coupon.usageLimit) *
                            100
                        )}%`
                      : "∞"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Redemption Types */}
            <Card>
              <CardHeader>
                <CardTitle>Redemption Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics?.redemptionsByType?.orders || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics?.redemptionsByType?.enrollments || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Enrollments
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics?.redemptionsByType?.products || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Products
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {analytics?.redemptionsByType?.courses || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Courses</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Redemptions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Redemptions</CardTitle>
              </CardHeader>
              <CardContent>
                {redemptions.length > 0 ? (
                  <div className="space-y-4">
                    {redemptions.slice(0, 10).map((redemption, index) => (
                      <div
                        key={redemption._id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {redemption.learner?.fullName || "Unknown User"}
                            </span>
                            <Badge variant="outline">
                              {redemption.learner?.email}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {redemption.appliedToProduct && (
                              <span>
                                Product: {redemption.appliedToProduct.title}
                              </span>
                            )}
                            {redemption.appliedToCourse && (
                              <span>
                                Course: {redemption.appliedToCourse.title}
                              </span>
                            )}
                            {redemption.orderId && (
                              <span>
                                Order: #{redemption.orderId.orderNumber}
                              </span>
                            )}
                            {redemption.enrollmentId && (
                              <span>
                                Enrollment: {redemption.enrollmentId.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            TK. {redemption.discountedAmount?.toFixed(2) || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(redemption.usedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No redemptions yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
