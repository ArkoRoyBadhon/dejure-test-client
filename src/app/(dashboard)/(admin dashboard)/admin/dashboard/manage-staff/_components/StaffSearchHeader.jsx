"use client";
import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const StaffSearchHeader = ({ searchQuery, setSearchQuery, onCreateClick }) => {
  const inputRef = useRef(null);

  // Aggressively clear any unwanted autofill values
  useEffect(() => {
    if (
      searchQuery &&
      (searchQuery.includes("@") ||
        searchQuery.includes("admin") ||
        searchQuery.includes("gmail"))
    ) {
      setSearchQuery("");
    }
  }, [searchQuery, setSearchQuery]);

  // Clear on focus to prevent autofill
  const handleFocus = () => {
    if (inputRef.current && inputRef.current.value) {
      inputRef.current.value = "";
      setSearchQuery("");
    }
  };

  // Clear on input to prevent autofill
  const handleInput = (e) => {
    const value = e.target.value;
    if (
      value.includes("@") ||
      value.includes("admin") ||
      value.includes("gmail")
    ) {
      e.target.value = "";
      setSearchQuery("");
    } else {
      setSearchQuery(value);
    }
  };

  // Clear on blur to prevent autofill
  const handleBlur = () => {
    if (inputRef.current && inputRef.current.value) {
      const value = inputRef.current.value;
      if (
        value.includes("@") ||
        value.includes("admin") ||
        value.includes("gmail")
      ) {
        inputRef.current.value = "";
        setSearchQuery("");
      }
    }
  };

  // Force clear input on mount and periodically
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    // Clear every 100ms for first 2 seconds to prevent autofill
    const interval = setInterval(() => {
      if (inputRef.current && inputRef.current.value) {
        const value = inputRef.current.value;
        if (
          value.includes("@") ||
          value.includes("admin") ||
          value.includes("gmail")
        ) {
          inputRef.current.value = "";
          setSearchQuery("");
        }
      }
    }, 100);

    setTimeout(() => clearInterval(interval), 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-gray2 px-4 py-4 rounded-t-[16px] border">
      <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            name="staff-search-input"
            id="staff-search-input"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          onClick={onCreateClick}
          className="bg-main hover:bg-main/90 text-white py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
        >
          + Add New Staff
        </button>
      </div>
    </div>
  );
};

export default StaffSearchHeader;
