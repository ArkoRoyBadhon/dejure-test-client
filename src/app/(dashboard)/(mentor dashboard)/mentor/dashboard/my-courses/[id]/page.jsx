"use client";
import CourseDetailsInfo from "@/components/Course/CourseDetailsInfo";
import { useParams } from "next/navigation";

export default function MyCourseDetailsPage() {
  const { id } = useParams();
  return <CourseDetailsInfo id={id} />;
}
