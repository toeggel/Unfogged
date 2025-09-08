import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";

export const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return { userLocation, error };
};
