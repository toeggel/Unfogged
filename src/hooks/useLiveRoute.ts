import { useState, useEffect, useMemo } from "react";
import { RoutePoint, StrollRoute } from "../routes/buildRouteMask";
import { simplifyRoute } from "../routes/gpxImport";

/**
 * Tracks the user live and produces a StrollRoute
 */
export const useLiveStrollRoute = (name = "Live Route") => {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [location, setLocation] = useState<RoutePoint | null>(null);
  const [sessionKey] = useState(() => `live-${Date.now()}`);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: Date.now() };
        setLocation(pt);
        setPoints((prev) => [...prev, pt]);
      },
      (err) => console.warn(err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  const liveRoute: StrollRoute | null = useMemo(() => {
    if (points.length === 0) {
      return null;
    }

    const simplifiedRoute = simplifyRoute(points);
    return {
      name,
      description: "Live Route",
      points: simplifiedRoute,
    };
  }, [points, name]);

  return { liveRoute, location, sessionKey };
};
