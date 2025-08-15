// geo/buildRouteMask.ts
import { lineString, featureCollection, polygon } from '@turf/helpers';
import { buffer } from '@turf/buffer';
import { union } from '@turf/union';
import { difference } from '@turf/difference';
import type {
  Feature, FeatureCollection, LineString, Polygon, MultiPolygon
} from 'geojson';

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp?: number;
}
export interface StrollRoute {
  name: string;
  description?: string;
  points: RoutePoint[];
}

/**
 * Builds a “world mask” with holes cut where your buffered routes are.
 * Returns null if nothing is left to mask.
 */
export function buildRouteMask(
  routes: StrollRoute[],
  bufferMeters: number,
  bufferSteps: number = 8 // smoothness of the buffer
): Feature<Polygon | MultiPolygon> | null {
  // 1) lines from your routes
  const lines: Feature<LineString>[] = routes
    .map(r => r.points.map(p => [p.lng, p.lat] as [number, number]))
    .filter(coords => coords.length >= 2)
    .map(coords => lineString(coords));

  // If no lines, just mask nothing (or return the world polygon if you prefer)
  if (lines.length === 0) return null;

  // 2) buffer lines (meters)
  const buffered = buffer(
    featureCollection(lines),
    bufferMeters,
    { units: 'meters', steps: bufferSteps }
  ) as FeatureCollection<Polygon>;

  // 3) union all buffers into one polygon/multipolygon
  const buffersUnion = union(buffered) as Feature<Polygon | MultiPolygon>;

  // 4) world polygon (WGS84/Leaflet)
  const world = polygon([[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]);

  // 5) subtract buffers from world => a mask with holes where routes are
  // Turf v7 difference takes a FeatureCollection of [base, subtractor].
  // Returns null if the subtractor covers everything. :contentReference[oaicite:2]{index=2}
  return difference(featureCollection([world, buffersUnion]));
}
