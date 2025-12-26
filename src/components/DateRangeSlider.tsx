import React, { useState } from "react";

interface DateRangeSliderProps {
  startDate: Date;
  minDate: Date;
  maxDate: Date;
  onDateChange: (date: Date) => void;
}

const formatDate = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}.${year}`;
};

export const DateRangeSlider: React.FC<DateRangeSliderProps> = ({ startDate, minDate, maxDate, onDateChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const totalMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());
  const currentMonths =
    (startDate.getFullYear() - minDate.getFullYear()) * 12 + (startDate.getMonth() - minDate.getMonth());

  const handleSliderChange = (months: number) => {
    const newDate = new Date(minDate);
    newDate.setMonth(minDate.getMonth() + months);
    onDateChange(newDate);
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-[1000] bottom-3 flex justify-center w-64">
      {isOpen ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col items-center px-2 pt-1 pb-2 w-full">
          <button
            type="button"
            aria-label="Hide date range slider"
            className="flex items-center justify-center w-full mb-1 focus:outline-none cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" mx-auto h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`flex flex-col items-center w-full overflow-hidden 
            ${isOpen ? "max-h-32 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
          >
            <div className="flex items-center justify-between text-xs text-gray-700 mb-1 w-full">
              <span className="text-gray-500">{minDate.getFullYear()}</span>
              <span className="font-semibold text-sm text-gray-800">{formatDate(startDate)}</span>
              <span className="text-gray-500">Now</span>
            </div>
            <input
              type="range"
              min={0}
              max={totalMonths}
              value={currentMonths}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="mb-1 w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600
                focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Show date range slider"
          className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};
