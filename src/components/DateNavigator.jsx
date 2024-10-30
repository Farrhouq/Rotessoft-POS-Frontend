import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";

export default function DateNavigator({ offset, setOffset }) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const currentDate = new Date(today);
  currentDate.setDate(today.getDate() + offset);

  const formatDate = (date) => {
    if (offset === 0) return "Today";
    if (offset === -1) return "Yesterday";
    if (offset === 1) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const goBack = () => {
    setOffset((prev) => prev - 1);
  };

  const goForward = () => {
    setOffset((prev) => prev + 1);
  };

  const goToToday = () => {
    setOffset(0);
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const diffTime = selectedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setOffset(diffDays);
    setShowDatePicker(false);
  };

  return (
    <div className="flex items-center space-x-2 h-fit bg-white dark:bg-gray-800 p-1.5 px-5 rounded-lg shadow">
      <button
        onClick={goBack}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="flex gap-2 items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {formatDate(currentDate)}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>
      {showDatePicker && (
        <input
          type="date"
          onChange={handleDateChange}
          className="absolute mt-8 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
        />
      )}
      {offset !== 0 && (
        <>
          <button
            onClick={goForward}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Next day"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={goToToday}
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            Today
          </button>
        </>
      )}
    </div>
  );
}
