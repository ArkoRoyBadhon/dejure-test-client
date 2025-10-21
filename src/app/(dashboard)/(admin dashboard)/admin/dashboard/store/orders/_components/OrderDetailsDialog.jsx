"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useUpdateOrderStatusMutation } from "@/redux/features/Products/Order.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export function OrderDetailsDialog({ order, open, onOpenChange }) {
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;

    try {
      setIsUpdating(true);
      await updateOrderStatus({
        id: order._id,
        status: selectedStatus,
      }).unwrap();

      toast.success("Order status updated successfully");
      onOpenChange(false); // Close the dialog after successful update
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error(error?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6 ">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Order Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p>#{order._id.slice(-6).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p>
                    {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "default"
                        : order.status === "pending"
                        ? "secondary"
                        : order.status === "cancelled"
                        ? "destructive"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <Badge variant="outline" className="capitalize">
                    {order.paymentMethod}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Products</h3>
              <div className="space-y-4">
                {order.products.map((item) => (
                  <div key={item._id} className="flex gap-4 border-b pb-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${item.product.image}`}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.title}</h4>
                      <p className="text-sm text-gray-500">
                        ৳{item.unitPrice} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">৳{item.totalPrice}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer and Summary */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Customer</h3>
              <div className="space-y-1">
                <p className="font-medium">{order?.name || "unknwon"}</p>
                <p className="font-medium">{order.email}</p>
                <p className="text-sm">{order.phone}</p>
                {order.alterPhone && (
                  <p className="text-sm">Alt: {order.alterPhone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Shipping Address</h3>
              <p className="text-sm whitespace-pre-line">{order.address}</p>
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span>৳{order.totalPrice - order.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Delivery Fee</span>
                <span>৳{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>৳{order.totalPrice}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Update Order Status</p>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleStatusUpdate}
                  disabled={
                    isUpdating ||
                    !selectedStatus ||
                    selectedStatus === order.status
                  }
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
