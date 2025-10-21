"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LearnersSelect({ control, learners }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const filteredLearners = learners.filter((learner) =>
    learner.name.toLowerCase().includes(search.toLowerCase())
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FormField
      control={control}
      name="learners"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Learners</FormLabel>
          <div className="relative" ref={ref}>
            <div
              className="flex items-center justify-between w-full p-2 border cursor-pointer bg-gray1 rounded-[16px]"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="truncate">
                {field.value?.length > 0
                  ? `${field.value.length} selected`
                  : "Select learners"}
              </span>
              <ChevronDown
                className={`h-4 w-4 opacity-50 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {isOpen && (
              <div className="absolute h-[260px] z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search learners..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between items-center p-2 border-b">
                  <div
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const allLearnerIds = filteredLearners.map((l) => l.id);
                      field.onChange(allLearnerIds);
                    }}
                    className="font-bold cursor-pointer"
                  >
                    Select All
                  </div>
                  <div
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      field.onChange([]);
                    }}
                    className="font-bold cursor-pointer"
                  >
                    Clear All
                  </div>
                </div>
                <div className="h-[140px] overflow-y-auto">
                  {filteredLearners.length > 0 ? (
                    filteredLearners.map((learner) => (
                      <div
                        key={learner.id}
                        className="flex items-center p-2 hover:bg-gray-100"
                      >
                        <Checkbox
                          checked={field.value?.includes(learner.id)}
                          className="mr-2 data-[state=checked]:bg-main data-[state=checked]:border-main"
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || [];
                            const newValues = checked
                              ? [...currentValues, learner.id]
                              : currentValues.filter((id) => id !== learner.id);
                            field.onChange(newValues);
                          }}
                        />
                        <span>{learner.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No learners found</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
