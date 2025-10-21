import { useState } from "react";
import { CreateProductDialog } from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/store/product/_components/CreateProductDialog";
import { DeleteProductDialog } from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/store/product/_components/DeleteProductDialog";
import { Edit, Trash, MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden  relative">
      {/* Three-dot menu button */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={toggleMenu}
          className="py-1 rounded-md bg-yellow-50 transition-colors border border-yellow-500"
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>

        {/* Dropdown menu */}
        {isMenuOpen && (
          <div className="absolute right-0 w-20  shadow-lg bg-white ">
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <CreateProductDialog product={product} onClose={closeMenu}>
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Update
                </button>
              </CreateProductDialog>
              <DeleteProductDialog product={product} onClose={closeMenu}>
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Delete
                </button>
              </DeleteProductDialog>
            </div>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="relative flex items-center justify-center">
        <Link href={`/de-jury-shop/${product._id}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
            alt={product.title}
            width={400} // optionally use real dimensions if you have
            height={300}
            className=" h-[180px] w-[130px]"
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title (Takes remaining space) */}
        <div className="flex-1">
          <h3 className="text-center text-base font-semibold">
            {product.title}
          </h3>
        </div>

        {/* Price & Buttons pinned at the bottom */}
        <div className="space-y-3 pt-2">
          {/* Price */}
          <div className="flex justify-center items-center gap-2 text-sm">
            <span className="text-black font-bold">৳{product.price}</span>
            {product.oldPrice && (
              <span className="text-red-500 line-through">
                ৳{product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
