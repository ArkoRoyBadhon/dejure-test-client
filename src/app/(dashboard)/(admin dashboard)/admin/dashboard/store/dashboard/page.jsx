"use client";
import PermissionError from "@/components/shared/PermissionError";
import ProductCard from "@/components/shared/ProductCard";
import ProductCategoryCard from "@/components/shared/ProductCategoryCard";
import { useGetAllOrdersQuery } from "@/redux/features/Products/Order.api";
import { useGetAllproductCategoriesQuery } from "@/redux/features/Products/ProductCategory.api";
import { useGetAllProductsQuery } from "@/redux/features/Products/Products.api";
import {
  BarChart3,
  CalendarCheck,
  Layers,
  PackageCheck,
  ShoppingCart,
  Wallet,
  Clock,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StoreManagementPage() {
  const { data: Categories, error: CategoriesError } =
    useGetAllproductCategoriesQuery();
  const { data: Products, error: ProductsError } = useGetAllProductsQuery();
  const {
    data: orders = [],
    error: OrdersError,
    isLoading,
  } = useGetAllOrdersQuery();

  // Calculate best selling products based on actual orders
  const calculateBestSellers = () => {
    if (!orders || !Products) return [];

    // Create a map to track product sales
    const productSales = new Map();

    // Process all orders to calculate product sales
    orders.forEach((order) => {
      if (order.products && order.products.length > 0) {
        order.products.forEach((item) => {
          const productId = item.product._id;
          const quantity = item.quantity || 1;
          const unitPrice = item.unitPrice || item.product.price || 0;
          const totalPrice = quantity * unitPrice;

          if (productSales.has(productId)) {
            const existing = productSales.get(productId);
            productSales.set(productId, {
              ...existing,
              sales: existing.sales + quantity,
              revenue: existing.revenue + totalPrice,
            });
          } else {
            // Find the product details
            const product =
              Products.find((p) => p._id === productId) || item.product;
            productSales.set(productId, {
              id: productId,
              name: product.title,
              sales: quantity,
              revenue: totalPrice,
              product: product, // Store the full product object for reference
            });
          }
        });
      }
    });

    // Convert map to array and sort by sales (descending)
    return Array.from(productSales.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10); // Get top 10 best sellers
  };

  const bestSellingProducts = calculateBestSellers();

  // Calculate total revenue
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  // Filter orders for current month
  const currentMonthOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    return (
      orderDate.getMonth() === currentDate.getMonth() &&
      orderDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Filter orders for current week
  const currentWeekOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    const oneWeekAgo = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    return orderDate >= oneWeekAgo;
  });

  // Prepare chart data
  const chartData = [
    {
      name: "Products",
      Total: Products?.length || 0,
    },
    {
      name: "Categories",
      Total: Categories?.length || 0,
    },
    {
      name: "Month Orders",
      Total: currentMonthOrders.length,
    },
    {
      name: "Week Orders",
      Total: currentWeekOrders.length,
    },
    {
      name: "All Orders",
      Total: orders.length,
    },
  ];

  const statCards = [
    {
      title: "Total Products",
      value: Products?.length || 0,
      icon: <PackageCheck className="text-blue-600 w-8 h-8" />,
      color: "text-blue-600",
    },
    {
      title: "Total Categories",
      value: Categories?.length || 0,
      icon: <Layers className="text-blue-600 w-8 h-8" />,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: <Wallet className="text-blue-600 w-8 h-8" />,
      color: "text-blue-600",
    },
    {
      title: "Current Month Orders",
      value: currentMonthOrders.length,
      icon: <CalendarCheck className="text-green-600 w-8 h-8" />,
      color: "text-green-600",
    },
    {
      title: "Current Week Orders",
      value: currentWeekOrders.length,
      icon: <BarChart3 className="text-green-600 w-8 h-8" />,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: <ShoppingCart className="text-green-600 w-8 h-8" />,
      color: "text-green-600",
    },
  ];

  return (
    <div className="mt-4 px-4">
      <div className="mx-auto">
        <div className="px-6 py-4 bg-[#fff8e5] rounded-xl border flex justify-start items-center mb-1 mx-auto">
          <span className="text-[#141B34] font-semibold text-2xl">
            DE JURE SHOP
          </span>
        </div>

        {/* States */}
        <div className="my-4 rounded-xl shadow-sm border bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {statCards.map((card, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-main/5 border border-main shadow hover:shadow-md transition"
              >
                <div className="p-2 bg-white rounded-full shadow">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium">
                    {card.title}
                  </h3>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="my-6 rounded-xl shadow-md bg-white">
          <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
              <BarChart3 className="text-blue-600" />
              <span className="text-[#141B34] font-bold text-lg">
                Store Statistics
              </span>
            </div>
          </div>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Total" fill="#FFB800" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders and Best Sellers Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Recent Orders */}
          <div className="md:w-1/2 w-full rounded-xl shadow-md bg-white">
            <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="text-blue-600" />
                <span className="text-[#141B34] font-bold text-lg">
                  Recent Orders
                </span>
              </div>
              <Link href="/admin/dashboard/store/orders">
                <button className="border border-yellow-500 bg-yellow-50 hover:bg-yellow-300 py-1 px-2 rounded-2xl font-bold shadow text-sm">
                  View All
                </button>
              </Link>
            </div>
            <div className="p-4">
              {OrdersError?.data?.message ===
              "Insufficient module permissions" ? (
                <div className="text-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 font-medium">
                      Permission Denied
                    </p>
                    <p className="text-red-500 text-sm">
                      You don't have permission to view orders
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#fff8e5]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {order?.name || "unknown"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            TK. {order.totalPrice}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Best Selling Products */}
          <div className="md:w-1/2 w-full rounded-xl shadow-md bg-white">
            <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-600" />
                <span className="text-[#141B34] font-bold text-lg">
                  Best Selling Products
                </span>
              </div>

              <Link href="/admin/dashboard/store/product">
                <button className="border border-yellow-500 bg-yellow-50 hover:bg-yellow-300 py-1 px-2 rounded-2xl font-bold shadow text-sm">
                  View All
                </button>
              </Link>
            </div>
            <div className="p-4">
              {ProductsError?.data?.message ===
                "Insufficient module permissions" ||
              OrdersError?.data?.message ===
                "Insufficient module permissions" ? (
                <div className="text-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 font-medium">
                      Permission Denied
                    </p>
                    <p className="text-red-500 text-sm">
                      You don't have permission to view sales data
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#fff8e5]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bestSellingProducts.slice(0, 10).map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {product.sales}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            ৳{product.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {bestSellingProducts.length === 0 && (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-2 text-center text-sm text-gray-500"
                          >
                            No sales data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories and Products Section */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Categories Part */}
          <div className="my-6 rounded-xl shadow-md md:w-1/2 w-full">
            <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-[#141B34] font-bold text-lg">
                  Categories
                </span>
              </div>
              <div>
                <Link href="/admin/dashboard/store/category">
                  <button className="border border-yellow-500 bg-yellow-50 hover:bg-yellow-300 py-1 px-2 rounded-2xl font-bold shadow">
                    more..
                  </button>
                </Link>
              </div>
            </div>
            {CategoriesError?.data?.message ===
            "Insufficient module permissions" ? (
              <div className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-medium">Permission Denied</p>
                  <p className="text-red-500 text-sm">
                    You don't have permission to view categories
                  </p>
                </div>
              </div>
            ) : Categories?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-2">
                {Categories.slice(0, 3).map((category) => (
                  <ProductCategoryCard key={category._id} category={category} />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No categories found
              </div>
            )}
          </div>

          {/* Products Part */}
          <div className="my-6 rounded-xl shadow-md md:w-1/2 w-full">
            <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center mb-1">
              <div className="flex items-center gap-1">
                <span className="text-[#141B34] font-bold text-lg">
                  Products
                </span>
              </div>
              <div>
                <Link href="/admin/dashboard/store/product">
                  <button className="border border-yellow-500 bg-yellow-50 hover:bg-yellow-300 shadow-md py-1 px-2 rounded-2xl font-bold">
                    more..
                  </button>
                </Link>
              </div>
            </div>
            {ProductsError?.data?.message ===
            "Insufficient module permissions" ? (
              <div className="p-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-medium">Permission Denied</p>
                  <p className="text-red-500 text-sm">
                    You don't have permission to view products
                  </p>
                </div>
              </div>
            ) : Products?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {Products.slice(0, 3).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="p-4 text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
