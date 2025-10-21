"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  useChangeAdminPasswordMutation,
  useGetAdminQuery,
  useUpdateAdminProfileMutation,
} from "@/redux/features/auth/admin.api";

export default function AdminProfilePage() {
  // RTK Query hooks
  const { data: admin, isLoading } = useGetAdminQuery();
  const [updateAdminProfile, { isLoading: updating }] =
    useUpdateAdminProfileMutation();
  const [changeAdminPassword, { isLoading: changing }] =
    useChangeAdminPasswordMutation();

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    email: "",
    role: "",
    image: "",
    isActive: true,
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

  // Initialize form with admin data
  useEffect(() => {
    if (admin) {
      setProfileData({
        fullName: admin.fullName || "",
        phone: admin.phone || "",
        email: admin.email || "",
        role: admin.role || "",
        image: admin.image || "",
        isActive: admin.isActive || true,
      });
    }
  }, [admin]);

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("phone", profileData.phone);
      formData.append("email", profileData.email);
      formData.append("role", profileData.role);
      formData.append("isActive", profileData.isActive);

      // Append image if it's a File object
      if (profileData.image && profileData.image instanceof File) {
        formData.append("image", profileData.image);
      }

      await updateAdminProfile(formData).unwrap();
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
      await changeAdminPassword({
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
          <img src="/course.svg" alt="Admin Logo" />
          <p className="font-bold">অ্যাডমিন প্রোফাইল</p>
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
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray1"
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
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray1"
                  placeholder="ফোন নম্বর লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">ইমেইল</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray1"
                  placeholder="ইমেইল লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">ভূমিকা</label>
                <input
                  type="text"
                  value={profileData.role}
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray1 uppercase"
                  placeholder="ইমেইল লিখুন"
                />
                {/* <select
                  value={profileData.role}
                  onChange={(e) =>
                    setProfileData({ ...profileData, role: e.target.value })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                >
                  <option value="superadmin">সুপার অ্যাডমিন</option>
                  <option value="admin">অ্যাডমিন</option>
                  <option value="representative">প্রতিনিধি</option>
                </select> */}
              </div>

              <button
                type="submit"
                className="bg-main hover:bg-main/90 text-darkColor border border-gray-200 w-full py-2 rounded font-bold"
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
                    className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray1"
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
                    className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray1"
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
                    className="border-2 border-gray-200 rounded px-3 py-2 w-full bg-gray1"
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
                className="bg-main hover:bg-main/90 text-darkColor border border-gray-200 w-full py-2 rounded font-bold"
                disabled={changing}
              >
                {changing ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
              </button>
            </form>
          </div>

          {/* Right Column: Additional Info */}
          <div className="flex-1 border border-gray-200 p-4 rounded-md">
            <h2 className="font-bold text-base mb-4">অ্যাকাউন্ট তথ্য</h2>

            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm">অ্যাকাউন্ট স্ট্যাটাস</p>
                <p className="font-medium">
                  {admin?.isActive ? (
                    <span className="text-green-500">সক্রিয়</span>
                  ) : (
                    <span className="text-red-500">নিষ্ক্রিয়</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">অ্যাকাউন্ট ভূমিকা</p>
                <p className="font-medium capitalize">
                  {admin?.role === "superadmin" && "সুপার অ্যাডমিন"}
                  {admin?.role === "admin" && "অ্যাডমিন"}
                  {admin?.role === "staff" && "স্টাফ"}
                  {admin?.role === "representative" && "প্রতিনিধি"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">অ্যাকাউন্ট তৈরি হয়েছে</p>
                <p className="font-medium">
                  {admin?.createdAt
                    ? new Date(admin.createdAt).toLocaleString("bn-BD")
                    : "তথ্য পাওয়া যায়নি"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
