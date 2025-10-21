"use client";

import React from "react";
import Loader from "./Loader";

const LoadingState = ({
  message = "Loading...",
  showSpinner = true,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      {showSpinner && <Loader />}
      <p className="text-gray-600 mt-4 text-center">{message}</p>
    </div>
  );
};

export default LoadingState;
