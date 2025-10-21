import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

// Sample data format
const sampleEvents = {
  "2025-08-08": [
    {
      type: "জেনারেল ক্লাস",
      title:
        "প্রয়োগ প্রণালীর নিরাপদ ব্যবহার MCQ + Short Question Solving Class",
      description: "প্রয়োগ প্রণালীর নিরাপদ ব্যবহার",
      time: "সকাল ০৬:০০ - সকাল ০৭:৩০",
    },
    {
      type: "Reading Part",
      title: "Reading Part",
      description: "Reading & understanding Bengali passages",
      time: "no time specified",
    },
  ],
  "2025-08-22": [
    {
      type: "সময়সূচী",
      title: "সময়সূচী ইভেন্ট",
      description: "Sample schedule event",
      time: "সকাল ০৯:০০ - সকাল ১০:০০",
    },
  ],
  "2025-08-24": [
    {
      type: "Guideline",
      title: "Guideline Part 1",
      description: "+১ খাটো",
      time: "",
    },
  ],
  "2025-08-16": [
    {
      type: "Guideline",
      title: "Guideline Part 2",
      description: "+২ খাটো",
      time: "",
    },
  ],
  "2025-08-11": [
    {
      type: "মার্গদর্শক চিঠি",
      title: "মার্গদর্শক চিঠি Event",
      description: "Guidance letter",
      time: "",
    },
  ],
};

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [viewMode, setViewMode] = useState("একাডেমিক প্রোগ্রাম");

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
    if (sampleEvents[isoDate]) {
      setSelectedDate(date);
      setSelectedEvents(sampleEvents[isoDate]);
    } else {
      setSelectedDate(null);
      setSelectedEvents([]);
    }
  };

  const monthName = bengaliMonths[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const getEventColorClass = (eventType) => {
    if (eventType.includes("জেনারেল") || eventType === "জেনারেল ক্লাস")
      return "bg-green-500";
    if (
      eventType === "Reading Part" ||
      eventType.toLowerCase().includes("reading")
    )
      return "bg-blue-500";
    if (eventType.includes("সময়সূচী")) return "bg-orange-500";
    if (eventType.includes("Guideline")) return "bg-blue-600";
    if (eventType.includes("মার্গদর্শক")) return "bg-teal-600";
    return "bg-green-500";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-6">
          <div className="flex w-[50%] items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
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
          {/* View Mode Selector */}
          <RadioGroup
            defaultValue="একাডেমিক প্রোগ্রাম"
            value={viewMode}
            onValueChange={setViewMode}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="একাডেমিক প্রোগ্রাম" id="r1" />
              <Label htmlFor="r1">একাডেমিক প্রোগ্রাম</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="অনুশীলন কোর্স" id="r2" />
              <Label htmlFor="r2">অনুশীলন কোর্স</Label>
            </div>
          </RadioGroup>
        </div>
        {/* Header */}

        {/* Calendar */}
        <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b ">
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
                    const events = sampleEvents[isoDate] || [];
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
