import { LatLngExpression } from "leaflet";
import { useMap } from "react-leaflet";
import React, { useEffect } from "react";

export const FlyToLocation: React.FC<{ position: LatLngExpression | null }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);

  return null;
};
