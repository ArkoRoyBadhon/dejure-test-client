"use client";

import { useState } from "react";
import { useGetAllCouponRedemptionsQuery } from "@/redux/features/coupon/coupon.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  ShoppingCart,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function CouponRedemptionsTable() {
  const [page, setPage] = useState(1);
  const [couponFilter, setCouponFilter] = useState("all");
  const [learnerFilter, setLearnerFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useGetAllCouponRedemptionsQuery({
    page,
    limit: 20,
    couponId: couponFilter !== "all" ? couponFilter : undefined,
    learnerId: learnerFilter || undefined,
  });

  const redemptions = data?.data?.redemptions || [];
  const pagination = data?.data?.pagination;

  const getStatusBadge = (redemption) => {
    if (redemption.orderId) {
      return (
        <Badge variant="outline" className="text-blue-600">
          Order
        </Badge>
      );
    }
    if (redemption.enrollmentId) {
      return (
        <Badge variant="outline" className="text-green-600">
          Enrollment
        </Badge>
      );
    }
    if (redemption.appliedToProduct) {
      return (
        <Badge variant="outline" className="text-purple-600">
          Product
        </Badge>
      );
    }
    if (redemption.appliedToCourse) {
      return (
        <Badge variant="outline" className="text-orange-600">
          Course
        </Badge>
      );
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getAppliedTo = (redemption) => {
    if (redemption.orderId) {
      return `Order #${redemption.orderId.orderNumber}`;
    }
    if (redemption.enrollmentId) {
      return `Enrollment (${redemption.enrollmentId.status})`;
    }
    if (redemption.appliedToProduct) {
      return redemption.appliedToProduct.title;
    }
    if (redemption.appliedToCourse) {
      return redemption.appliedToCourse.title;
    }
    return "N/A";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Coupon Redemptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 border items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by learner name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-md"
              />
            </div>
          </div>
          <Select value={couponFilter} onValueChange={setCouponFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by coupon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coupons</SelectItem>
              {/* Add coupon options here if needed */}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading redemptions...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading redemptions
          </div>
        ) : redemptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No redemptions found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Applied To</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((redemption) => (
                    <TableRow key={redemption._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {redemption.learner?.fullName || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {redemption.learner?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {redemption.coupon?.code}
                          </div>
                          <div className="text-sm text-gray-500">
                            {redemption.coupon?.discountType === "FIXED"
                              ? `TK. ${redemption.coupon?.DiscountFixed}`
                              : `${redemption.coupon?.DiscountPercentage}%`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {getAppliedTo(redemption)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">
                          TK. {redemption.discountedAmount?.toFixed(2) || 0}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(redemption)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(redemption.usedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
