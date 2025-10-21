import { useGetCategoryWiseCourseQuery } from "@/redux/features/course/course.api";
import Image from "next/image";
import { CategoryDropdownMenu } from "../Admin/Categories/CategoryDropdownMenu";

export default function CategoryCard({
  category,
  selectedCategoryId,
  onClick,
  onEdit,
  onDelete,
}) {
  const { data: categoryCourses = [], isLoading } =
    useGetCategoryWiseCourseQuery(category._id, {
      skip: !category._id,
    });

  return (
    <div
      className={`p-2 rounded-lg border flex justify-between items-center hover:shadow-sm transition cursor-pointer ${
        selectedCategoryId === category._id
          ? "border-yellow-600 bg-yellow-50"
          : "border-main-200"
      }`}
      onClick={() => onClick(category)}
    >
      <div className="flex items-center gap-3">
        {category.thumbnail && (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${category.thumbnail}`}
            alt={category.title}
            height={10}
            width={10}
            unoptimized
            className="h-10 w-10 object-cover rounded"
          />
        )}
        <div>
          <p className="font-medium">{category.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-gray-500">
              Subcategories:{" "}
              <span className="bg-yellow-100 text-yellow-700 border border-yellow-400 px-1 rounded-full">
                {category.subCategories?.length || 0}
              </span>
            </p>

            <p className="text-xs text-gray-500">
              Listed Courses:{" "}
              <span className="bg-yellow-100 text-yellow-900 border border-yellow-400 px-1 rounded-full ">
                {isLoading ? "..." : categoryCourses?.length || 0}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="text-center">
          <CategoryDropdownMenu
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
        {category.isActive && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
            ACTIVE
          </span>
        )}
      </div>
    </div>
  );
}
