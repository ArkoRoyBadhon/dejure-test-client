import { useGetAllEnrollmentsQuery } from "@/redux/features/enroll/enroll.api";
import Loader from "@/components/shared/Loader";

export default function Enrollment({ id }) {
  const { data: enrollments, isLoading, isError } = useGetAllEnrollmentsQuery();

  if (isLoading) return <Loader text="Loading enrollments..." />;
  if (isError) return <div>Error loading enrollments</div>;

  // Filter enrollments for the current course ID and only paid enrollments
  const courseEnrollments = enrollments?.filter(
    (enrollment) => enrollment.course?._id === id && enrollment.payment?.isPaid
  );

  return (
    <div>
      <div className="px-6 py-4 bg-[#F2F7FC] rounded-t-xl border flex justify-between items-center">
        <div className="grid grid-cols-3 w-full text-sm font-medium text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-[#141B34] font-bold text-lg">
              এনরোল্ড স্টুডেন্টস
            </span>
          </div>
          <div></div>
        </div>
      </div>

      {courseEnrollments?.length > 0 ? (
        <div className="overflow-x-auto border rounded bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {courseEnrollments.map((enrollment, index) => (
                <tr key={enrollment._id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{enrollment.learner?.fullName}</td>
                  <td className="px-4 py-2">{enrollment.learner?.email}</td>
                  <td className="px-4 py-2">
                    {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">
          No enrolled students found for this course.
        </p>
      )}
    </div>
  );
}
