import React from "react";

export interface DateRangeSliderProps {
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
  const totalMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());
  const currentMonths =
    (startDate.getFullYear() - minDate.getFullYear()) * 12 + (startDate.getMonth() - minDate.getMonth());

  const handleSliderChange = (months: number) => {
    const newDate = new Date(minDate);
    newDate.setMonth(minDate.getMonth() + months);
    onDateChange(newDate);
  };

  return (
    <div className="w-full">
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
        className="mb-1 w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
      />
    </div>
  );
};
