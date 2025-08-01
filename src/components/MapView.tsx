import React, { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMockGeolocation } from '../hooks/useMockGeolocation';
import { MOCK_STROLL_ROUTES, StrollRoute } from '../mocks/visitedPlaces';
import { parseGpxToStrollRoute } from '../mocks/gpxImport';
import * as turf from '@turf/turf';

const FOG_RADIUS_METERS = 60; // Radius around each visited point to "unfog"

const MapView: React.FC = () => {
    const mapRef = useRef<any>(null);
    const userLocation = useMockGeolocation();

    // State for imported GPX routes
    const [importedRoutes, setImportedRoutes] = useState<StrollRoute[]>([]);

    // Example: Load a GPX file from the mocks folder on mount (for demo purposes)
    useEffect(() => {
        // You can replace this with a file picker or fetch as needed
        fetch('/src/mocks/Workout-2025-07-17-16-12-28.gpx')
            .then(res => res.text())
            .then(gpxText => parseGpxToStrollRoute(gpxText, "Imported GPX Route"))
            .then(route => setImportedRoutes([route]))
            .catch(() => setImportedRoutes([]));
    }, []);

    // Combine all routes (mocked + imported)
    const allRoutes = useMemo(
        () => [...MOCK_STROLL_ROUTES, ...importedRoutes],
        [importedRoutes]
    );

    const routeRings = useMemo(() => {
        const allPolygons: {
            coordinates: [number, number][][];
            opacity: number;
            name: string;
            ringIndex: number;
        }[] = [];

        return allRoutes.map(route => {
            const line = turf.lineString(route.points.map(p => [p.lng, p.lat]));
            let distance = FOG_RADIUS_METERS
            for (let i = 0; i < 10; i++) {
                distance = distance - (distance * (0.1));
                const outer = turf.buffer(line, distance, { units: 'meters' });
                const coords = outer?.geometry.coordinates.map(ring =>
                    ring.map(([lng, lat]) => [lat, lng] as [number, number])
                ) || [];
                allPolygons.push({
                    name: route.name,
                    coordinates: coords,
                    opacity: 0.015,
                    ringIndex: i
                });
            }

            return allPolygons;
        });
    }, [allRoutes]);

    return (
        <MapContainer
            center={[47.3769, 8.5417]}
            zoom={13}
            scrollWheelZoom={true}
            ref={mapRef}
            className="h-full"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Fog of war polygon with merged holes */}
            {routeRings.flatMap(a => a).map((a, i) => (
                <Polygon
                    key={`${i}`}
                    positions={a.coordinates}
                    pathOptions={{
                        color: "blue",
                        weight: 0,
                        fillOpacity: a.opacity,
                        fillColor: "blue",
                        opacity: a.opacity
                    }}
                />
            ))}
            <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                    Mocked user location
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapView;