"use client";
import { useState, useEffect } from "react";
import {
  useChangePasswordMutation,
  useGetLearnersQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth/learner.api";
import Image from "next/image";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: learner, isLoading } = useGetLearnersQuery();

  // Pre-fill from learner data when loaded
  const [profileData, setProfileData] = useState({
    fullName: "",
    primaryPhone: "",
    altEmail: "",
    altPhone: "",
    image: "",
    shippingAddress: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    occupation: "",
    gender: "",
    educationBackground: "",
    institution: "",
    address: "",
    age: "",
  });

  useEffect(() => {
    if (learner) {
      setProfileData({
        fullName: learner.fullName || "",
        primaryPhone: learner.phone || "",
        altEmail: learner.secondaryEmail || "",
        altPhone: learner.secondaryPhone || "",
        image: learner.image || "",
        shippingAddress: learner.shippingAddress || "",
      });
      setAdditionalInfo({
        occupation: learner.currentOccupation || "",

        gender: learner.gender || "",
        educationBackground: learner.educationBackground || "",
        institution: learner.educationalInstitution || "",
        address: learner.address || "",
        age: learner.age || "",
      });
    }
  }, [learner]);

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

  // RTK Query hooks
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();

  // Profile update handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName);
      formData.append("phone", profileData.primaryPhone);
      formData.append("secondaryEmail", profileData.altEmail);
      formData.append("secondaryPhone", profileData.altPhone);
      formData.append("shippingAddress", profileData.shippingAddress);
      // If image is a File, append it
      if (profileData.image && profileData.image instanceof File) {
        formData.append("image", profileData.image);
      }
      // Additional info
      formData.append("currentOccupation", additionalInfo.occupation);

      formData.append("gender", additionalInfo.gender);
      formData.append(
        "educationBackground",
        additionalInfo.educationBackground
      );
      formData.append("educationalInstitution", additionalInfo.institution);
      formData.append("address", additionalInfo.address);
      formData.append("age", additionalInfo.age);

      const res = await updateProfile(formData).unwrap();
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      toast.error(err?.data?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে!");
    }
  };

  // Password change handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("নতুন এবং নিশ্চিত পাসওয়ার্ড মিলছে না!");
      return;
    }
    try {
      await changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err?.data?.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে!"
      );
    }
  };

  // Additional Info handler
  const handleAdditionalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("currentOccupation", additionalInfo.occupation);
      formData.append("gender", additionalInfo.gender);
      formData.append(
        "educationBackground",
        additionalInfo.educationBackground
      );
      formData.append("educationalInstitution", additionalInfo.institution);
      formData.append("address", additionalInfo.address);
      formData.append("age", additionalInfo.age);

      // If you have sector/interestedSector field:
      if (additionalInfo.sector) {
        formData.append("interestedSector", additionalInfo.sector);
      }

      await updateProfile(formData).unwrap();
      toast.success("অতিরিক্ত তথ্য সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      toast.error(
        err?.data?.message || "অতিরিক্ত তথ্য আপডেট করতে সমস্যা হয়েছে!"
      );
    }
  };

  // Dropdown options
  const genderOptions = ["male", "female", "other"];

  const educationOptions = [
    "এসএসসি",
    "এইচএসসি",
    "ডিগ্রি",
    "মাস্টার্স",
    "অন্যান্য",
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto py-6 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto border bg-white rounded-xl">
        <div className="flex p-4 gap-2 rounded-t-xl bg-[#F2F7FC] border-b">
          <img src="/course.svg" alt="Course Logo" />
          <p className="font-bold">প্রোফাইল</p>
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
                  ছবি আপলোড করুন
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setProfileData({
                          ...profileData,
                          image: file,
                        });
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="text-sm font-bold block">পুরো নাম</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="আপনার পুরো নাম লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">
                  প্রাইমারী নাম্বার
                </label>
                <input
                  type="text"
                  value={profileData.primaryPhone}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      primaryPhone: e.target.value,
                    })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="প্রাইমারী নাম্বার লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">
                  অল্টারনেটিভ ইমেইল
                </label>
                <input
                  type="text"
                  value={profileData.altEmail}
                  onChange={(e) =>
                    setProfileData({ ...profileData, altEmail: e.target.value })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="অল্টারনেটিভ ইমেইল লিখুন"
                />
              </div>

              <div>
                <label className="text-sm font-bold block">
                  অল্টারনেটিভ নাম্বার
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value="+88"
                    disabled
                    className="border-2 border-gray-200 rounded-l px-3 py-2 bg-gray-100 w-16"
                  />
                  <input
                    type="text"
                    value={profileData.altPhone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        altPhone: e.target.value,
                      })
                    }
                    className="border-2 border-gray-200 rounded-r px-3 py-2 w-full"
                    placeholder="অল্টারনেটিভ নাম্বার লিখুন"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold block">ঠিকানা</label>
                <input
                  type="text"
                  value={profileData.shippingAddress}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      shippingAddress: e.target.value,
                    })
                  }
                  className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                  placeholder="ঠিকানা লিখুন"
                />
              </div>

              <button
                type="submit"
                className="bg-yellow-400 border border-gray-200 w-full py-2 rounded font-bold"
                disabled={updating}
              >
                {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
              </button>
            </form>

            {/* Password Change Form */}
            <form
              onSubmit={handlePasswordSubmit}
              className="border p-4 rounded-md space-y-4 border-gray-200"
            >
              <h2 className="font-bold text-base mb-2 text-center border-b pb-2">
                পাসওয়ার্ড চেঞ্জ করুন
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
                  নিশ্চিত পাসওয়ার্ড
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
                {changing ? "আপডেট হচ্ছে..." : "আপডেট"}
              </button>
            </form>
          </div>

          {/* Right Column: Additional Info */}
          <form
            onSubmit={handleAdditionalInfoSubmit}
            className="flex-1 border border-gray-200 p-4 rounded-md space-y-4"
          >
            <div>
              <label className="text-sm font-bold block">বর্তমান পেশা</label>
              <input
                type="text"
                value={additionalInfo.occupation}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    occupation: e.target.value,
                  })
                }
                className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                placeholder="বর্তমান পেশা লিখুন"
              />
            </div>

            <div>
              <label className="text-sm font-bold block">লিঙ্গ</label>
              <select
                value={additionalInfo.gender}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    gender: e.target.value,
                  })
                }
                className="border-2 border-gray-200 rounded px-3 py-2 w-full"
              >
                <option value="">লিঙ্গ নির্বাচন করুন</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold block">বয়স</label>
              <input
                type="text"
                value={additionalInfo.age}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    age: e.target.value,
                  })
                }
                className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                placeholder="বয়স লিখুন"
              />
            </div>

            <div>
              <label className="text-sm font-bold block">
                এডুকেশনাল ব্যাকগ্রাউন্ড
              </label>
              <select
                value={additionalInfo.educationBackground}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    educationBackground: e.target.value,
                  })
                }
                className="border-2 border-gray-200 rounded px-3 py-2 w-full"
              >
                <option value="">শিক্ষা নির্বাচন করুন</option>
                {educationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold block">
                শিক্ষা প্রতিষ্ঠান
              </label>
              <input
                type="text"
                value={additionalInfo.institution}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    institution: e.target.value,
                  })
                }
                className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                placeholder="শিক্ষা প্রতিষ্ঠানের নাম লিখুন"
              />
            </div>

            <div>
              <label className="text-sm font-bold block">আপনার ঠিকানা</label>
              <input
                type="text"
                value={additionalInfo.address}
                onChange={(e) =>
                  setAdditionalInfo({
                    ...additionalInfo,
                    address: e.target.value,
                  })
                }
                className="border-2 border-gray-200 rounded px-3 py-2 w-full"
                placeholder="ঠিকানা লিখুন"
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-400 border border-gray-200 w-full py-2 rounded font-bold mt-2"
              disabled={updating}
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
