import React from "react";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

interface GpxImportButtonProps {
  onFilesSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const GpxImportButton: React.FC<GpxImportButtonProps> = ({ onFilesSelected }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Import GPX files"
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 flex items-center justify-center focus:outline-none"
        onClick={handleButtonClick}
        title="Import GPX files"
      >
        <div className="h-6 w-6">
          <ArrowUpOnSquareIcon />
        </div>
      </button>
      <input
        ref={fileInputRef}
        id="gpx-upload"
        type="file"
        accept=".gpx"
        multiple
        className="hidden"
        onChange={onFilesSelected}
        tabIndex={-1}
        aria-label="Select one or more .gpx files from your device"
      />
    </>
  );
};
