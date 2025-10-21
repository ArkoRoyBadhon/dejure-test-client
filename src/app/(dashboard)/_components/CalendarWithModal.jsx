"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetRoutinesByCourseQuery } from "@/redux/features/routine/routine.api";
import {
  useGetCoursesByLearnerQuery,
  useGetCoursesByMentorQuery,
} from "@/redux/features/course/course.api";

const bengaliDays = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const bengaliMonths = [
  "জানুয়ারী",
  "ফেব্রুয়ারী",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

function getMonthDays(year, month) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function formatDate(date) {
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  if (m < 10) m = "0" + m;
  if (d < 10) d = "0" + d;
  return `${y}-${m}-${d}`;
}

export default function CalendarWithModal() {
  const { user } = useSelector((state) => state.auth);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [routines, setRoutines] = useState({});

  // Fetch courses based on user role
  const { data: mentorCourses } = useGetCoursesByMentorQuery(undefined, {
    skip: user?.role !== "mentor",
  });
  const { data: learnerCourses } = useGetCoursesByLearnerQuery(undefined, {
    skip: user?.role !== "learner",
  });

  // Fetch routines when course is selected
  const { data: routinesData } = useGetRoutinesByCourseQuery(selectedCourse, {
    skip: !selectedCourse,
  });

  useEffect(() => {
    if (user?.role === "mentor" && mentorCourses?.data) {
      setCourses(mentorCourses.data);
      // Set first course as default if not already selected
      if (mentorCourses.data.length > 0 && !selectedCourse) {
        setSelectedCourse(mentorCourses.data[0]._id);
      }
    } else if (user?.role === "learner" && learnerCourses?.data) {
      setCourses(learnerCourses.data);
      // Set first course as default if not already selected
      if (learnerCourses.data.length > 0 && !selectedCourse) {
        setSelectedCourse(learnerCourses.data[0]._id);
      }
    }
  }, [user?.role, mentorCourses, learnerCourses, selectedCourse]);

  useEffect(() => {
    if (routinesData) {
      // Transform routines data into calendar events format
      const formattedRoutines = {};

      routinesData.forEach((routine) => {
        const dateKey = formatDate(new Date(routine.date));

        if (!formattedRoutines[dateKey]) {
          formattedRoutines[dateKey] = [];
        }

        // Create event for class if exists
        if (routine.classTitle && routine.classTime) {
          formattedRoutines[dateKey].push({
            type: "ক্লাস",
            title: routine.classTitle,
            description: `${routine.subjectTypeId?.subjectType} - ${routine.subjectId?.name}`,
            time: routine.classTime,
          });
        }

        // Create event for exam if exists
        if (routine.examTitle && routine.examTime) {
          formattedRoutines[dateKey].push({
            type: "পরীক্ষা",
            title: routine.examTitle,
            description: `${routine.subjectTypeId?.subjectType} - ${routine.subjectId?.name}`,
            time: routine.examTime,
          });
        }
      });

      setRoutines(formattedRoutines);
    } else {
      setRoutines({});
    }
  }, [routinesData]);

  const daysOfMonth = getMonthDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const startingDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setSelectedDate(null);
    setSelectedEvents([]);
    setCurrentDate((prev) => {
      const newMonth = prev.getMonth() - 1;
      return new Date(prev.getFullYear(), newMonth, 1);
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    setSelectedEvents([]);
    setCurrentDate((prev) => {
      const newMonth = prev.getMonth() + 1;
      return new Date(prev.getFullYear(), newMonth, 1);
    });
  };

  const handleDateClick = (date) => {
    const isoDate = formatDate(date);
    if (routines[isoDate]) {
      setSelectedDate(date);
      setSelectedEvents(routines[isoDate]);
    } else {
      setSelectedDate(null);
      setSelectedEvents([]);
    }
  };

  const monthName = bengaliMonths[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const getEventColorClass = (eventType) => {
    if (eventType === "ক্লাস") return "bg-green-500";
    if (eventType === "পরীক্ষা") return "bg-red-500";
    if (eventType === "Reading Part") return "bg-blue-500";
    if (eventType.includes("সময়সূচী")) return "bg-orange-500";
    if (eventType.includes("Guideline")) return "bg-blue-600";
    if (eventType.includes("মার্গদর্শক")) return "bg-teal-600";
    return "bg-green-500";
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-6">
          <div className="flex w-[50%] items-center justify-between p-4 h-[66px] border rounded-lg bg-white shadow-sm">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <span className="text-xl">&#8249;</span>
            </Button>

            <div className="text-lg font-semibold">
              {monthName} {year}
            </div>

            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <span className="text-xl">&#8250;</span>
            </Button>
          </div>

          {/* Course Selector */}
          <div className="flex items-center gap-4 w-full h-fit">
            <Select
              value={selectedCourse}
              onValueChange={(value) => {
                setSelectedCourse(value);
                setSelectedDate(null);
                setSelectedEvents([]);
              }}
              className="w-full h-[66px] bg-white"
            >
              <SelectTrigger className="w-full !h-[66px] bg-white">
                <SelectValue placeholder="কোর্স নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar */}
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {bengaliDays.map((day, i) => (
                  <th
                    key={i}
                    className="p-3 text-sm font-bold text-darkColor text-center"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, week) => (
                <tr key={week} className="border-b last:border-b-0">
                  {Array.from({ length: 7 }).map((_, day) => {
                    const dayIndex = week * 7 + day;
                    const calendarDayIndex = dayIndex - startingDay;

                    if (
                      calendarDayIndex < 0 ||
                      calendarDayIndex >= daysOfMonth.length
                    ) {
                      return <td key={day} className="h-24 w-24 p-1"></td>;
                    }

                    const dateObj = daysOfMonth[calendarDayIndex];
                    const isoDate = formatDate(dateObj);
                    const events = routines[isoDate] || [];
                    const isSelected =
                      selectedDate && isoDate === formatDate(selectedDate);

                    return (
                      <td
                        key={day}
                        className={cn(
                          "h-24 max-w-24 p-1 border-r border-gray-100 hover:bg-gray-50",
                          isSelected && "bg-blue-50"
                        )}
                        onClick={() => handleDateClick(dateObj)}
                      >
                        <div className="h-full flex flex-col">
                          <div className="text-sm font-medium p-1 text-center">
                            {dateObj.getDate()}
                          </div>
                          <div className="flex-1 overflow-y-auto space-y-1">
                            {events.map((event, idx) => (
                              <Popover key={idx}>
                                <PopoverTrigger asChild>
                                  <div
                                    className={cn(
                                      "text-xs px-2 py-1 rounded truncate text-white cursor-pointer",
                                      getEventColorClass(event.type)
                                    )}
                                  >
                                    {event.title}
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80" align="start">
                                  <div className="space-y-2">
                                    <h4 className="font-medium leading-none">
                                      {event.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {event.description}
                                    </p>
                                    {event.time && (
                                      <p className="text-xs text-gray-500">
                                        সময়: {event.time}
                                      </p>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ))}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
