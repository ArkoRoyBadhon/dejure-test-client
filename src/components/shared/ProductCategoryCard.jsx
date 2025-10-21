import { useState } from "react";
import { DeleteDialog } from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/store/category/_components/CategoryDeleteDialog";
import { CreateCategoryDialog } from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/store/category/_components/CreateCategoryDialog";
import { Edit, Trash, MoreVertical } from "lucide-react";
import Image from "next/image";

export default function ProductCategoryCard({ category }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow hover:shadow-md transition duration-300 relative">
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
          <div className="absolute right-0 w-20 shadow-lg bg-white">
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <CreateCategoryDialog category={category} onClose={closeMenu}>
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Update
                </button>
              </CreateCategoryDialog>
              <DeleteDialog category={category} onClose={closeMenu}>
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  Delete
                </button>
              </DeleteDialog>
            </div>
          </div>
        )}
      </div>

      {/* Image Section */}
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL}/${category.image}`}
        alt={category.title}
        height={160}
        width={160}
        className="object-contain w-full h-40"
      />

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 text-center">
          {category.title}
        </h3>
      </div>
    </div>
  );
}
