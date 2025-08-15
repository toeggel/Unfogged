// components/RouteMaskLayer.tsx
import { GeoJSON } from 'react-leaflet';
import type { Feature, Polygon, MultiPolygon } from 'geojson';

export function RouteMaskLayer({
  mask,
  color = '#000',
  fillOpacity = 0.55,
}: {
  mask: Feature<Polygon | MultiPolygon> | null;
  color?: string;
  fillOpacity?: number;
}) {
    console.log("Rendering RouteMaskLayer with mask:", mask);
  if (!mask) return null;
  return (
    <GeoJSON
      data={mask}
      interactive={false}
      style={{
        // fill covers the world; the “holes” (your routes) are transparent
        fillColor: color,
        fillOpacity,
        // no stroke outline
        color,
        weight: 0,
        opacity: 0,
      }}
    />
  );
}
