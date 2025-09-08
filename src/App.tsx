import React from "react";
import { MapView } from "./components/MapView";

export const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <MapView />
    </div>
  );
};
