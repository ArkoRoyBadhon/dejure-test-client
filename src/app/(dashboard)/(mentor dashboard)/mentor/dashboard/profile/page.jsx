"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  useChangePasswordMentorMutation,
  useGetMentorProfileQuery,
  useUpdateMentorMutation,
} from "@/redux/features/auth/mentor.api";
import { useGetCoursesByMentorQuery } from "@/redux/features/course/course.api";

export default function MentorProfilePage() {
  // RTK Query hooks
  const { data: mentor, isLoading } = useGetMentorProfileQuery();
  const [updateMentor, { isLoading: updating }] = useUpdateMentorMutation();
  const [changePasswordMentor, { isLoading: changing }] =
    useChangePasswordMentorMutation();
  const { data: allOwnedCourses } = useGetCoursesByMentorQuery();

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    email: "",
    teacherId: "",
    image: "",
    designation: "",
    description: "",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Initialize form with mentor data
  useEffect(() => {
    if (mentor) {
      setProfileData({
        fullName: mentor.fullName || "",
        phone: mentor.phone || "",
        email: mentor.email || "",
        teacherId: mentor.teacherId || "",
        image: mentor.image || "",
        designation: mentor.designation || "",
        description: mentor.description || "",
      });
    }
  }, [mentor]);

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("phone", profileData.phone);
      formData.append("email", profileData.email);
      formData.append("teacherId", profileData.teacherId);
      formData.append("designation", profileData.designation);
      formData.append("description", profileData.description);

      // Append image if it's a File object
      if (profileData.image && profileData.image instanceof File) {
        formData.append("image", profileData.image);
      }

      await updateMentor(formData).unwrap();
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      toast.error(err?.data?.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে!");
    }
  };

  // Password change handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলে না!");
      return;
    }
    try {
      await changePasswordMentor({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err?.data?.message || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে!"
      );
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        image: file,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto py-6 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto border bg-white rounded-xl">
        <div className="flex p-4 gap-2 rounded-t-xl bg-[#F2F7FC] border-b">
          <img src="/course.svg" alt="Course Logo" />
          <p className="font-bold">মেন্টর প্রোফাইল</p>
        </div>

        <div className="flex flex-col md:flex-row gap-2 p-2 text-sm items-start">
          <div className="flex-1 space-y-4">
            {/* Profile Info Form */}
            <form
              onSubmit={handleProfileSubmit}
              className="border p-4 rounded-md space-y-4"
              encType="multipart/form-data"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 border border-dashed rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  {profileData.image &&
                  typeof profileData.image === "string" ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${profileData.image}`}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : profileData.image ? (
                    <Image
                      src={URL.createObjectURL(profileData.image)}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/user.png"
                      alt="Default User"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <label className="text-xs bg-gray-200 px-1 py-1 mt-2 cursor-pointer">
                  ইমেজ আপলোড
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <label className="text-sm font-bold block">পুরো নাম</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      fullName: e.target.value,
                    })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="আপনার পুরো নাম লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">ফোন নম্বর</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="ফোন নম্বর লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">ইমেইল</label>
                <input
                  type="email"
                  value={profileData.email}
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="text-sm font-bold block">শিক্ষক আইডি</label>
                <input
                  type="text"
                  value={profileData.teacherId}
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray-100"
                  disabled
                />
              </div>

              <div>
                <label className="text-sm font-bold block">পদবী</label>
                <input
                  type="text"
                  value={profileData.designation}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      designation: e.target.value,
                    })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="আপনার পদবী লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">বিবরণ</label>
                <textarea
                  value={profileData.description}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="বিবরণ লিখুন"
                />
              </div>

              <button
                type="submit"
                className="bg-yellow-400 border border-gray-200 w-full py-2 rounded font-bold"
                disabled={updating}
              >
                {updating ? "আপডেট হচ্ছে..." : "প্রোফাইল আপডেট করুন"}
              </button>
            </form>

            {/* Password Change Form */}
            <form
              onSubmit={handlePasswordSubmit}
              className="border p-4 rounded-md space-y-4 border-gray-200"
            >
              <h2 className="font-bold text-base mb-2 text-center border-b pb-2">
                পাসওয়ার্ড পরিবর্তন করুন
              </h2>

              <div>
                <label className="text-sm font-bold block">
                  বর্তমান পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  >
                    {showPassword.current ? "👁️" : "🙈"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold block">
                  নতুন পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                  >
                    {showPassword.new ? "👁️" : "🙈"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold block">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPassword.confirm ? "👁️" : "🙈"}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="bg-yellow-400 border border-gray-200 w-full py-2 rounded font-bold mt-2"
                disabled={changing}
              >
                {changing ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
              </button>
            </form>
          </div>

          {/* Right Column: Additional Info - Empty for now */}
          <div className="flex-1 border border-gray-200 p-4 rounded-md">
            <h2 className="font-bold text-base mb-4">আমার কোর্সসমূহ</h2>

            {allOwnedCourses?.data?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allOwnedCourses.data.map((course) => (
                  <div
                    key={course._id}
                    className="border rounded-md overflow-hidden"
                  >
                    <div className="h-40 relative">
                      {course.thumbnail ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 h-full flex items-center justify-center">
                          <span className="text-gray-500">কোন ইমেজ নেই</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">এখনও কোন কোর্স বরাদ্দ করা হয়নি</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
