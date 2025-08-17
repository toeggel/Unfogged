import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMockGeolocation } from "../hooks/useMockGeolocation";
import { MOCK_STROLL_ROUTES, StrollRoute } from "../mocks/visitedPlaces";
import { parseGpxToStrollRoute } from "../mocks/gpxImport";
import { buildRouteMask } from "../buildRouteMask";
import { RouteMaskLayer } from "./RouteMaskLayer";

const FOG_RADIUS_METERS = 30; // Radius around each visited point to "unfog"

const MapView: React.FC = () => {
  const userLocation = useMockGeolocation();

  // State for imported GPX routes
  const [importedRoutes, setImportedRoutes] = useState<StrollRoute[]>([]);

  // Example: Load a GPX file from the mocks folder on mount (for demo purposes)
  useEffect(() => {
    const files = [
      "/src/mocks/Workout-2025-07-17-16-12-28.gpx",
      "/src/mocks/Workout-2025-08-16-10-28-36.gpx",
    ];

    Promise.all(
      files.map((file) =>
        fetch(file)
          .then((res) => res.text())
          .then((gpxText) => parseGpxToStrollRoute(gpxText, file))
      )
    )
      .then((routes) => setImportedRoutes(routes))
      .catch((err) => {
        console.error("Failed to load GPX files:", err);
        setImportedRoutes([]);
      });
  }, []);

  // Combine all routes (mocked + imported)
  const allRoutes = useMemo(() => {
    console.log("Combining routes:", [
      ...importedRoutes,
      ...MOCK_STROLL_ROUTES,
    ]);
    return [...importedRoutes, ...MOCK_STROLL_ROUTES];
  }, [importedRoutes]);

  const mask = useMemo(
    () => buildRouteMask(allRoutes, FOG_RADIUS_METERS),
    [allRoutes]
  );

  if (!importedRoutes.length) {
    return <div>Loading GPX data…</div>;
  }

  return (
    <MapContainer
      center={[47.401344, 8.534294]}
      zoom={20}
      style={{ height: "100vh" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <RouteMaskLayer mask={mask.mask} routes={mask.routes} />
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>Mocked user location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
