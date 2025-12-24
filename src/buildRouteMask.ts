import { lineString, featureCollection, polygon } from "@turf/helpers";
import { buffer } from "@turf/buffer";
import { union } from "@turf/union";
import { difference } from "@turf/difference";
import type { Feature, LineString, Polygon, MultiPolygon } from "geojson";
import { splitArrayIntoChunks } from "./utils/array-helper";

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
 * Builds a “world mask” with holes cut where the buffered routes are.
 * Returns null if nothing is left to mask.
 */

/**
 * Builds a world mask with holes cut where buffered routes are, plus graduated fog rings.
 *
 * @param routes - Array of StrollRoute objects with GPS coordinates
 * @param bufferMeters - Distance in meters to buffer around each route
 * @param fogLevels - Number of graduated fog rings around routes (default: 2)
 * @returns Mask polygon with holes for routes, and array of fog ring polygons
 */
export const buildRouteMask = (
  routes: StrollRoute[],
  bufferMeters: number,
  fogLevels: number = 2, // number of additonal fog levels
): {
  mask: Feature<Polygon | MultiPolygon> | null;
  fogRings: Feature<Polygon | MultiPolygon>[];
} => {
  const lines: Feature<LineString>[] = createLine(routes.reverse());

  if (lines.length === 0) {
    return { mask: null, fogRings: [] };
  }

  const allRoutes = createRoutesPolygon(lines, bufferMeters);
  let worldMask = featureDifference([world, allRoutes]);

  const parts = splitArrayIntoChunks(lines, 5);
  const fogRings: Feature<Polygon | MultiPolygon>[] = [];
  let previousUnion: Feature<Polygon | MultiPolygon> | null = null;

  for (let i = 0; i < parts.length; i++) {
    const currentPoly = createRoutesPolygon(parts[i], bufferMeters);

    const uniquePoly =
      previousUnion != null ? (featureDifference([currentPoly, previousUnion]) ?? currentPoly) : currentPoly;

    fogRings.push(...createFogRings(fogLevels, bufferMeters, parts[i], uniquePoly));

    previousUnion =
      previousUnion != null ? (union(featureCollection([previousUnion, currentPoly])) ?? previousUnion) : currentPoly;
  }

  return {
    mask: worldMask,
    fogRings,
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

  for (let i = 0; i < fogLevels; i++) {
    const distance = bufferStep * i;
    const routesPolygon = createRoutesPolygon(lines, distance);
    foggedRoutes.push(routesPolygon);
  }

  // Build layers from differences between successive buffers (build rings)
  const foggedRings = foggedRoutes.reverse().map((current, i) => {
    const innerRing = i === 0 ? null : featureDifference([mainRoutePolygon, foggedRoutes[i - 1]]);

    return featureDifference(innerRing ? [mainRoutePolygon, current, innerRing] : [mainRoutePolygon, current]);
  });

  return foggedRings.filter((ring): ring is Feature<Polygon | MultiPolygon> => ring !== null).reverse();
};

const createLine = (routes: StrollRoute[]) => {
  return routes
    .map((r) => r.points.map((p) => [p.lng, p.lat]))
    .filter((coords) => coords.length >= 2)
    .map((coords) => lineString(coords));
};

const createRoutesPolygon = (lines: Feature<LineString>[], bufferMeters: number): Feature<Polygon | MultiPolygon> => {
  if (lines.length <= 0) {
    return polygon([]);
  }

  const buffered = buffer(featureCollection(lines), bufferMeters, defaultBufferSettings);

  if (!buffered || buffered.features.length === 0) {
    return polygon([]);
  }

  if (buffered.features.length === 1) {
    return buffered.features[0];
  }

  return union(buffered) ?? polygon([]);
};

const featureDifference = (features: Feature<Polygon | MultiPolygon>[]) => {
  return difference(featureCollection(features));
};
