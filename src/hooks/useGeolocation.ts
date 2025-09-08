import { useEffect, useState } from "react";

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSuccess = (position: GeolocationPosition) => {
      setLocation(position.coords);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
    };

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      });

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return { location, error };
};
