"use client";

import CourseDetailsInfo from "@/components/Course/CourseDetailsInfo";
import { useParams } from "next/navigation";

export default function ManageCoursePage() {
  const { id } = useParams();

  return <CourseDetailsInfo id={id} />;
}
