import { lineString, featureCollection, polygon } from "@turf/helpers";
import { buffer } from "@turf/buffer";
import { union } from "@turf/union";
import { difference } from "@turf/difference";
import type { Feature, FeatureCollection, LineString, Polygon, MultiPolygon } from "geojson";

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

const world = polygon([
  [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90],
  ],
]);

const defaultBufferSettings = {
  units: "meters" as const,
  steps: 8, // smoothness of the buffer,
};

/**
 * Builds a “world mask” with holes cut where your buffered routes are.
 * Returns null if nothing is left to mask.
 */
export const buildRouteMask = (
  routes: StrollRoute[],
  bufferMeters: number,
  fogLevels: number = 2, // number of additonal fog levels
): {
  mask: Feature<Polygon | MultiPolygon> | null;
  fogRings: Feature<Polygon | MultiPolygon>[];
} => {
  const lines: Feature<LineString>[] = createLine(routes);

  if (lines.length === 0) {
    return { mask: null, fogRings: [] };
  }

  const allRoutes = createRoutesPolygon(lines, bufferMeters);
  const worldMask = featureDifference([world, allRoutes]);

  let fogRings = createFogRings(fogLevels, bufferMeters, lines, allRoutes);

  return {
    mask: worldMask,
    fogRings: fogRings,
  };
};

const createFogRings = (
  fogLevels: number,
  bufferMeters: number,
  lines: Feature<LineString>[],
  mainRoutePolygon: Feature<Polygon | MultiPolygon>,
): Feature<Polygon | MultiPolygon>[] => {
  if (fogLevels <= 0) {
    return [];
  }

  const bufferStep = bufferMeters / (fogLevels + 1);
  const foggedRoutes: Feature<Polygon | MultiPolygon>[] = [];

  for (let i = 1; i <= fogLevels; i++) {
    const distance = bufferStep * i;
    const routesPolygon = createRoutesPolygon(lines, distance);
    foggedRoutes.push(routesPolygon);
  }

  // Build layers from differences between successive buffers (build rings)
  const foggedRings = foggedRoutes.reverse().map((current, i) => {
    const innerRing = i === 0 ? null : featureDifference([mainRoutePolygon, foggedRoutes[i - 1]]);

    return featureDifference(
      innerRing ? [mainRoutePolygon, current, innerRing] : [mainRoutePolygon, current],
    );
  });

  return foggedRings
    .filter((ring): ring is Feature<Polygon | MultiPolygon> => ring !== null)
    .reverse();
};

const createLine = (routes: StrollRoute[]) => {
  return routes
    .map((r) => r.points.map((p) => [p.lng, p.lat]))
    .filter((coords) => coords.length >= 2)
    .map((coords) => lineString(coords));
};

const createRoutesPolygon = (
  lines: Feature<LineString>[],
  bufferMeters: number,
): Feature<Polygon | MultiPolygon> => {
  const buffered = buffer(
    featureCollection(lines),
    bufferMeters,
    defaultBufferSettings,
  ) as FeatureCollection<Polygon>;

  return union(buffered) as Feature<Polygon | MultiPolygon>;
};

const featureDifference = (features: Feature<Polygon | MultiPolygon>[]) => {
  return difference(featureCollection(features));
};
