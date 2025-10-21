"use client";
import React from "react";
import ExamSubmissions from "../_components/ExamSubmittions";
import { useParams } from "next/navigation";

const page = () => {
  const { examid } = useParams();
  return (
    <div>
      <ExamSubmissions id={examid} />
    </div>
  );
};

export default page;
