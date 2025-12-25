import React from "react";

interface DateRangeSliderProps {
  startDate: Date;
  minDate: Date;
  maxDate: Date;
  onDateChange: (date: Date) => void;
}

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
    <div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-[1000] w-80"
      onMouseMove={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Show routes from: {startDate.toLocaleDateString()}</label>
        <input
          type="range"
          min={0}
          max={totalMonths}
          value={currentMonths}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{minDate.toLocaleDateString()}</span>
          <span>{maxDate.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
