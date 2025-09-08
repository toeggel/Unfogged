import { useState, useEffect } from "react";
import { LatLngExpression } from "leaflet";

export const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported");
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return { userLocation, error };
};
