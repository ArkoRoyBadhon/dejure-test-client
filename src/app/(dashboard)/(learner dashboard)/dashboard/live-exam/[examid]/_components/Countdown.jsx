"use client";
import { useEffect, useState } from "react";

const Countdown = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState();

  function calculateTimeLeft() {
    const now = new Date();
    const difference = targetTime.getTime() - now.getTime();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div className="flex gap-4 text-2xl font-mono">
      <div className="bg-gray-200 px-4 py-2 rounded">
        {String(timeLeft?.hours).padStart(2, "0")}
      </div>
      <div>:</div>
      <div className="bg-gray-200 px-4 py-2 rounded">
        {String(timeLeft?.minutes).padStart(2, "0")}
      </div>
      <div>:</div>
      <div className="bg-gray-200 px-4 py-2 rounded">
        {String(timeLeft?.seconds).padStart(2, "0")}
      </div>
    </div>
  );
};

export default Countdown;
