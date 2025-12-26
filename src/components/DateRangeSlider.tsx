import React from "react";

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
  const totalMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());
  const currentMonths =
    (startDate.getFullYear() - minDate.getFullYear()) * 12 + (startDate.getMonth() - minDate.getMonth());

  const handleSliderChange = (months: number) => {
    const newDate = new Date(minDate);
    newDate.setMonth(minDate.getMonth() + months);
    onDateChange(newDate);
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow px-2 py-1 z-[1000] w-64">
      <div className="flex items-center justify-between text-xs text-gray-700">
        <span className="text-gray-500">{minDate.getFullYear()}</span>
        <span className="font-semibold  text-sm">{formatDate(startDate)}</span>
        <span className="text-gray-500">Now</span>
      </div>
      <input
        type="range"
        min={0}
        max={totalMonths}
        value={currentMonths}
        onChange={(e) => handleSliderChange(parseInt(e.target.value))}
        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600
          [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
          focus:outline-none"
        style={{ touchAction: "none" }}
      />
    </div>
  );
};
