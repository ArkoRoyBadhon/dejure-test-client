"use client";

import { Button } from "@/components/ui/button";
import { useGetAllOrdersQuery } from "@/redux/features/Products/Order.api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { OrderDetailsDialog } from "./_components/OrderDetailsDialog";
import { filterOrders } from "./_components/_utils/filters";
import { OrdersFilters } from "./_components/Filters";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "all",
    paymentMethod: "all",
    date: null,
    month: "all",
  });
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      status: "all",
      paymentMethod: "all",
      date: null,
      month: "all",
    });
  };
  const filteredOrders = filterOrders(orders, filters);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="rounded-xl shadow-md">
        {/* Page Header */}
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
          {/* Breadcrumb Path */}
          {/* <div className="text-sm text-gray-500">
            <Link
              href="/admin/dashboard/store/dashboard"
              className="text-gray-400 hover:underline"
            >
              Store
            </Link>
            <span className="mx-1">›</span>
            <span className="text-gray-700 font-medium">Orders</span>
          </div> */}

          <div className="flex items-center gap-2">
            <span className="text-[#141B34] font-bold text-xl">
              MANAGE ORDERS
            </span>
          </div>

          <div></div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-b-xl px-6 py-4 shadow">
          {/* Filters */}
          <OrdersFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />

          {isLoading ? (
            <p className="text-center text-gray-500">Loading orders...</p>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 rounded-lg border">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{order.email}</p>
                          <p className="text-sm text-gray-500">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.products.map((item) => (
                            <div key={item._id} className="flex items-center">
                              <span className="mr-2">•</span>
                              <span>
                                {item.product.title} (x{item.quantity})
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>৳{order.totalPrice}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {order.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize ${
                            order.status === "pending"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                              : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : order.status === "shipped"
                              ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                              : order.status === "delivered"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="border border-gray-300 hover:bg-white"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {orders.length > 0
                ? "No orders match your filters."
                : "No orders found."}
            </p>
          )}
        </div>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
