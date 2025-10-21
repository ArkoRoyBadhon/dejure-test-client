import Image from "next/image";
import { Edit, MoreVertical, Power, Trash2 } from "lucide-react";

const MentorsTable = ({
  mentors,
  searchQuery,
  dropdownRefs,
  expandedDropdownId,
  toggleDropdown,
  handleEditClick,
  showConfirmationDialog,
  setSelectMentor
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Name
          </th>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
          >
            Teacher ID
          </th>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
          >
            Email
          </th>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
          >
            Phone
          </th>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {mentors?.length > 0 ? (
          mentors.map((mentor) => (
            <tr key={mentor._id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-4 w-6 md:h-10 md:w-10">
                    <Image
                      className="h-4 w-6 md:h-10 md:w-10 rounded-full"
                      src={
                        mentor.image
                          ? `${process.env.NEXT_PUBLIC_API_URL}/${mentor.image}`
                          : "/assets/icons/avatar.png"
                      }
                      height={40}
                      width={40}
                      alt={mentor.fullName}
                    />
                  </div>

                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {mentor.fullName}
                    </div>
                    <div className="text-xs text-gray-500 sm:hidden line-clamp-1">
                      {mentor.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                {mentor.teacherId || "N/A"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                {mentor.email}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                {mentor.phone || "N/A"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    mentor.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {mentor.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium relative">
                <MentorActions
                  mentor={mentor}
                  dropdownRefs={dropdownRefs}
                  expandedDropdownId={expandedDropdownId}
                  toggleDropdown={toggleDropdown}
                  handleEditClick={handleEditClick}
                  showConfirmationDialog={showConfirmationDialog}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
              {searchQuery
                ? "No mentors match your search"
                : "No mentors found"}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const MentorActions = ({
  mentor,
  dropdownRefs,
  expandedDropdownId,
  toggleDropdown,
  handleEditClick,
  showConfirmationDialog,
}) => {
  return (
    <div
      ref={(el) => {
        if (el) {
          dropdownRefs.current[mentor._id] = el;
        }
      }}
    >
      <button
        type="button"
        className="inline-flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-100"
        onClick={(e) => toggleDropdown(mentor._id, e)}
        aria-expanded={expandedDropdownId === mentor._id}
        aria-haspopup="true"
      >
        <MoreVertical className="h-4 w-4 text-gray-600" />
      </button>

      {expandedDropdownId === mentor._id && (
        <div className="absolute right-8 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg border">
          <div className="py-1" role="none">
            <button
              onClick={() => handleEditClick(mentor)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              role="menuitem"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => showConfirmationDialog(mentor, "toggle")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              role="menuitem"
            >
              <Power className="mr-2 h-4 w-4" />
              {mentor.isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => showConfirmationDialog(mentor, "delete")}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
              role="menuitem"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorsTable;
