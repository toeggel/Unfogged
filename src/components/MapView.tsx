import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView: React.FC = () => {
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current) {
            // Initialize map settings here if needed
        }
    }, []);

    return (
        <MapContainer 
            center={[47.3769, 8.5417]} // Zurich coordinates
            zoom={13} 
            scrollWheelZoom={false} 
            ref={mapRef}
            className="h-full"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Add markers or fog logic here */}
            <Marker position={[47.3769, 8.5417]}>
                <Popup>
                    Zurich city center.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapView;