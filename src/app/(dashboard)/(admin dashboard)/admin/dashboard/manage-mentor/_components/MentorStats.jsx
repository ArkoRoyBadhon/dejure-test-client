const MentorStats = ({ mentors }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-6">
      <div className="p-4 rounded-lg shadow border border-main bg-main/5">
        <h3 className="text-gray-500 text-sm font-medium">Total Mentors</h3>
        <p className="text-2xl font-bold text-main">{mentors?.length || 0}</p>
      </div>

      <div className="border-main bg-main/5 p-4 rounded-lg shadow border">
        <h3 className="text-gray-500 text-sm font-medium">Active Mentors</h3>
        <p className="text-2xl font-bold text-green-600">
          {mentors?.filter((mentor) => mentor.isActive).length || 0}
        </p>
      </div>

      <div className="border-main bg-main/5 p-4 rounded-lg shadow border">
        <h3 className="text-gray-500 text-sm font-medium">Inactive Mentors</h3>
        <p className="text-2xl font-bold text-purple-600">
          {mentors?.filter((mentor) => !mentor.isActive).length || 0}
        </p>
      </div>
    </div>
  );
};

export default MentorStats;