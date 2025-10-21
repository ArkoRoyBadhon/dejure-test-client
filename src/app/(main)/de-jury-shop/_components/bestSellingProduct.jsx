"use client";
import { useGetAllOrdersQuery } from "@/redux/features/Products/Order.api";
import { useGetAllProductsQuery } from "@/redux/features/Products/Products.api";
import Image from "next/image";
import Link from "next/link";

export default function BestSellingProduct() {
  const { data: Products } = useGetAllProductsQuery();
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();

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
              product: product,
            });
          }
        });
      }
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  };

  const bestSellingProducts = calculateBestSellers();

  const toBengaliNumber = (number) => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((digit) => bengaliDigits[Number(digit)])
      .join("");
  };

  return (
    <div className="flex flex-col relative z-[1] max-w-[1200px] mx-auto min-h-[40vh] my-auto pb-8 px-4 md:px-0 mt-16 md:mt-0">
      {/* Left hero content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/book.svg" alt="" />
          <p className="font-black text-2xl md:text-3xl Z">
            বেস্ট সেলিং প্রোডাক্ট
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button>
            <img src="/leftcircle.svg" alt="" />
          </button>
          <button>
            <img src="/rightSign.svg" alt="" />
          </button>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {bestSellingProducts.map((product) => (
          <Link key={product.id} href={`/de-jury-shop/${product.product._id}`}>
            <div className="flex items-center gap-6 border p-4 shadow-md rounded-xl h-[160px] cursor-pointer hover:bg-gray-100">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${product.product.image}`}
                alt={product.title}
                width={400}
                height={300}
                className=" h-[140px] w-[140px] rounded-xl"
              />
              <div className="space-y-4 flex flex-col  justify-between  h-full ">
                <p className="font-bold text-lg line-clamp-2">{product.name}</p>
                <span className="flex gap-4 text-xs items-center">
                  <p className="text-gray-600 bg-[#FFB80033] px-3 rounded-lg">
                    {product.product?.category?.title || "প্রোডাক্ট"}
                  </p>
                  <p className="text-gray-400">
                    {" "}
                    মোট {toBengaliNumber(product.product?.stock || 0)}টি বই
                  </p>
                </span>
                <span className="flex items-center gap-2 text-lg">
                  <p className="text-black font-bold">
                    {toBengaliNumber(product.product.price)} টাকা
                  </p>
                  {product.product.oldPrice && (
                    <p className="text-red-500 line-through text-sm">
                      {toBengaliNumber(product.product.oldPrice)} টাকা
                    </p>
                  )}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
