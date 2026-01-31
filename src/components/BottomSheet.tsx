import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { DateRangeSlider, DateRangeSliderProps } from "./DateRangeSlider";
import { GpxImportButton } from "./GpxImportButton";

interface BottomSheetProps extends DateRangeSliderProps {
  onFilesSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = (props) => {
  const [isOpen, setIsOpen] = useState(true);

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
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex flex-col items-center w-full overflow-hidden max-h-32 opacity-100 translate-y-0">
            <div className="flex margin-auto items-center justify-around text-xs text-gray-700 mb-1 w-full gap-2">
              <DateRangeSlider {...props} />
              <GpxImportButton onFilesSelected={props.onFilesSelected} />
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Show date range slider"
          className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>
  );
};
