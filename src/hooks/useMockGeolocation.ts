import { useEffect, useState } from "react";

export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

const MOCK_PATH: Location[] = [
  { lat: 47.3769, lng: 8.5417 }, // Zurich center
  { lat: 47.378, lng: 8.54 },
  { lat: 47.379, lng: 8.538 },
  { lat: 47.38, lng: 8.537 },
  { lat: 47.381, lng: 8.535 },
];

export function useMockGeolocation(intervalMs = 2000) {
  const [location, setLocation] = useState<Location>(MOCK_PATH[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setLocation(MOCK_PATH[0]);

    // const timer = setInterval(() => {
    //     setIndex((prev) => {
    //         const next = (prev + 1) % MOCK_PATH.length;
    //         setLocation(MOCK_PATH[next]);
    //         return next;
    //     });
    // }, intervalMs);
    // return () => clearInterval(timer);
  }, [intervalMs]);

  return location;
}
