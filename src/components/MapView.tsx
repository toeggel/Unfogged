import React, { useEffect, useMemo, useState } from "react";
import { LayersControl, MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { buildRouteMask, StrollRoute } from "../routes/buildRouteMask";
import { RouteMaskLayer } from "./RouteMaskLayer";
import { latLng } from "leaflet";
import { useImportedRoutes } from "../hooks/useImportedRoutes";
import { FlyToLocation } from "./FlyToLocation";
import { saveRoute } from "../storage/routeStore";
import { useLiveStrollRoute } from "../hooks/useLiveRoute";
import { customSvgIcon } from "../map/map-position";
import { parseGpxToStrollRoute } from "../routes/gpxImport";
import { BottomSheet } from "./BottomSheet";

const MAP_CENTER_GUGGACH = latLng(47.401263, 8.533942);
const FOG_RADIUS_METERS = 40;
const FOG_LEVELS = 1;
const MIN_DATE = new Date("2021-01-01");
const MAX_DATE = new Date();
const GPX_FILES: string[] = [
  "routes/Workout-2021-08-21-16-51-18.gpx",
  "routes/Workout-2023-07-27-15-57-27.gpx",
  "routes/Workout-2023-08-03-17-11-26.gpx",
  "routes/Workout-2023-08-10-15-36-57.gpx",
  "routes/Workout-2023-12-19-10-55-33.gpx",
  "routes/Workout-2024-07-16-16-07-28.gpx",
  "routes/Workout-2025-07-17-16-12-28.gpx",
  "routes/Workout-2025-08-16-10-28-36.gpx",
  "routes/Workout-2025-09-03-19-54-14.gpx",
  "routes/Workout-2025-09-07-11-40-11.gpx",
  "routes/Workout-2025-09-12-16-01-00.gpx",
  "routes/Workout-2025-10-29-13-15-01.gpx",
  "routes/Workout-2025-11-01-11-56-41.gpx",
  "routes/Workout-2025-11-14-13-31-50.gpx",
  "routes/Workout-2025-11-20-20-27-41.gpx",
  "routes/Workout-2025-11-22-11-53-06.gpx",
  "routes/Workout-2025-12-23-14-18-55.gpx",
  "routes/Workout-2025-12-26-14-36-11.gpx",
  "routes/Workout-2025-12-31-14-11-35.gpx",
  "routes/Workout-2026-01-02-12-41-20.gpx",
  "routes/Workout-2026-01-03-11-07-16.gpx",
  "routes/Workout-2026-01-10-11-43-44.gpx",
  "routes/Workout-2026-01-11-11-21-57.gpx",
  "routes/Workout-2026-01-17-13-19-42.gpx",

  // further away
  "routes/Workout-2026-01-01-11-45-21.gpx",
];

export const MapView: React.FC = () => {
  const { routes: importedRoutes, loading } = useImportedRoutes(GPX_FILES);
  // const { userLocation, error } = useGeolocation();
  const { liveRoute, location: userLocation, sessionKey } = useLiveStrollRoute();

  const [startDate, setStartDate] = useState<Date>(() => {
    const initDate = new Date();
    initDate.setFullYear(initDate.getFullYear() - 3);
    return initDate;
  });
  const [minDate, setMinDate] = useState<Date>(MIN_DATE);
  const [uploadedRoutes, setUploadedRoutes] = useState<StrollRoute[]>([]);

  // File input handler for GPX files
  const handleGpxFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const routes: StrollRoute[] = [];
    for (const file of files) {
      const text = await file.text();
      const route = await parseGpxToStrollRoute(text, file.name);
      if (route) {
        routes.push(route);
      }
    }

    setUploadedRoutes(routes);
  };

  useEffect(() => {
    if (!liveRoute) {
      return;
    }

    const interval = setInterval(() => saveRoute(sessionKey, liveRoute).catch(console.error), 10000);
    return () => clearInterval(interval);
  }, [liveRoute]);

  const allRoutes = useMemo(() => {
    const combined: StrollRoute[] = [...importedRoutes, ...uploadedRoutes];
    if (liveRoute) {
      combined.push(liveRoute);
    }
    return combined;
  }, [importedRoutes, uploadedRoutes, liveRoute]);

  const mask = useMemo(() => {
    const { mask, fogRings } = buildRouteMask(allRoutes, FOG_RADIUS_METERS, FOG_LEVELS);
    return { mask, fogRings, version: crypto.randomUUID() };
  }, [allRoutes]);

  useEffect(() => {
    const dateOfFirstRoute = allRoutes
      .map((r) => r.timestamp)
      .filter((timestamp) => !!timestamp)
      .sort((a, b) => a.getTime() - b.getTime())[0];

    if (dateOfFirstRoute) {
      const beginningOfYear = new Date(dateOfFirstRoute.getFullYear(), 0, 1);
      setMinDate(beginningOfYear);
    }
  }, [allRoutes]);

  // if (error) {
  //   console.warn("Geolocation error:", error);
  // }

  if (loading) {
    return <div>Loading GPX data…</div>;
  }

  return (
    <>
      <MapContainer center={userLocation || MAP_CENTER_GUGGACH} zoom={15} style={{ height: "100vh" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Esri Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <RouteMaskLayer
          key={`${startDate}-${mask.version}`}
          mask={mask.mask}
          routes={mask.fogRings}
          startDate={startDate}
        />

        <FlyToLocation position={userLocation || MAP_CENTER_GUGGACH} />
        <Marker position={userLocation || MAP_CENTER_GUGGACH} icon={customSvgIcon}></Marker>
      </MapContainer>
      <BottomSheet
        startDate={startDate}
        minDate={minDate}
        maxDate={MAX_DATE}
        onDateChange={setStartDate}
        onFilesSelected={handleGpxFiles}
      />
    </>
  );
};
