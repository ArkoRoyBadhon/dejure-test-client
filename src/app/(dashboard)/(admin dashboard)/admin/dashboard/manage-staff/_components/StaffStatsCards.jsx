"use client";
import React from "react";

const StaffStatsCards = ({ staffData, searchQuery }) => {
  // Extract the actual staff array from the nested data structure
  const staffArray = staffData?.data || [];

  const filteredStaff =
    staffArray.length > 0
      ? staffArray?.filter((staff) => {
          const query = searchQuery.toLowerCase();
          return (
            staff.name?.toLowerCase().includes(query) ||
            staff.email?.toLowerCase().includes(query) ||
            staff.phone?.toLowerCase().includes(query) ||
            staff.roleType?.name?.toLowerCase().includes(query)
          );
        })
      : [];

  const stats = [
    { title: "Total Staff", value: filteredStaff.length, color: "blue" },
    {
      title: "Active Staff",
      value: filteredStaff.filter((s) => s.isActive).length,
      color: "green",
    },
    {
      title: "Inactive Staff",
      value: filteredStaff.filter((s) => !s.isActive).length,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          // className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-4`}
          className={`bg-main/5 border border-main rounded-lg p-4`}
        >
          <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
          <p className={`text-2xl font-bold text-${stat.color}-600`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StaffStatsCards;
