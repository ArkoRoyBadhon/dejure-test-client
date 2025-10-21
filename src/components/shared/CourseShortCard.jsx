import Image from "next/image";
import Link from "next/link";

export default function CourseShortCard({ course, onClick }) {
  return (
    <Link href={`/courses/${course.slug}`} className="block" onClick={onClick}>
      <div className="bg-white rounded-xl p-3 flex gap-4 border hover:border-main shadow-sm hover:shadow-md transition h-full">
        <div className="relative w-[90px] h-[90px] flex-shrink-0 ">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
            alt={course.title}
            fill
            className="w-[90px] h-[90px] object-cover rounded"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-bold text-sm text-darkColor line-clamp-2">
            {course?.title}
          </h3>
          <p className="text-xs text-deepGray mb-auto mt-2 line-clamp-2">
            {course?.subTitle}
          </p>
          <div className="flex flex-wrap gap-2 text-xs mt-2">
            {course.batchNo && (
              <span className="bg-[#0047FF33] text-darkColor px-3 py-0.5 rounded-full">
                ব্যাচ {course?.batchNo}
              </span>
            )}
            {course.isActive && (
              <span className="bg-[#FFB80033] text-darkColor px-3 py-0.5 rounded-full">
                অনগোয়িং কোর্স
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
