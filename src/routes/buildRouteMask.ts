import { lineString, featureCollection, polygon } from "@turf/helpers";
import { buffer } from "@turf/buffer";
import { union } from "@turf/union";
import { difference } from "@turf/difference";
import type { Feature, LineString, Polygon, MultiPolygon } from "geojson";

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface StrollRoute {
  name: string;
  description?: string;
  points: RoutePoint[];
  line: Feature<LineString>;
  timestamp?: Date;
}

export interface FogRing {
  feature: Feature<Polygon | MultiPolygon>;
  date?: Date;
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
 * Builds a world mask with holes cut where buffered routes are, plus graduated fog rings.
 *
 * @param routes - Array of StrollRoute objects with GPS coordinates
 * @param bufferMeters - Distance in meters to buffer around each route
 * @param fogLevels - Number of graduated fog rings around routes
 * @returns Mask polygon with holes for routes, and array of fog ring polygons
 */
export const buildRouteMask = (
  routes: StrollRoute[],
  bufferMeters: number,
  fogLevels: number,
): {
  mask: Feature<Polygon | MultiPolygon> | null;
  fogRings: FogRing[];
} => {
  if (routes.length === 0) {
    return { mask: null, fogRings: [] };
  }

  const routesOrderedByTime = [...routes].sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0));
  const lines = routesOrderedByTime.map((r) => r.line);

  const allRoutes = bufferAndMergeRoutes(lines, bufferMeters);
  const worldMask = featureDifference([world, allRoutes]);

  const fogRings = createLayeredFogRings(routesOrderedByTime, bufferMeters, fogLevels);

  return {
    mask: worldMask,
    fogRings,
  };
};

/**
 * Creates layered fog rings for each route individually with date information.
 *
 * @param routes - Array of StrollRoute objects with GPS coordinates
 * @param bufferMeters - Distance in meters to buffer around each route
 * @param fogLevels - Number of graduated fog rings around each route
 * @returns Array of fog ring objects with features and dates
 */
const createLayeredFogRings = (routes: StrollRoute[], bufferMeters: number, fogLevels: number): FogRing[] => {
  const fogRings: FogRing[] = [];
  let previousUnion: Feature<Polygon | MultiPolygon> | null = null;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const lines = [route.line];
    const currentPolygon = bufferAndMergeRoutes(lines, bufferMeters);

    const uniquePolygon =
      previousUnion != null ? (featureDifference([currentPolygon, previousUnion]) ?? currentPolygon) : currentPolygon;

    const routeFogRings = createFogRings(fogLevels, bufferMeters, lines, uniquePolygon);
    fogRings.push(...routeFogRings.map((feature) => ({ feature, date: route.timestamp })));

    previousUnion =
      previousUnion != null
        ? (union(featureCollection([previousUnion, currentPolygon])) ?? previousUnion)
        : currentPolygon;
  }

  return fogRings;
};

/**
 * Creates concentric "fog rings" around a route polygon with graduated distances.
 *
 * Generates multiple buffer zones at increasing distances from the route, then subtracts
 * inner buffers from outer ones to create ring-shaped polygons. These rings represent
 * different fog opacity levels, with rings closer to the route being less fogged.
 *
 * @param fogLevels - Number of concentric rings to create
 * @param bufferMeters - Base buffer distance; rings are created at fractions of this distance
 * @param lines - LineString features to buffer at varying distances for creating the rings
 * @param mainRoutePolygon - The main route polygon to subtract from all rings
 * @returns Array of ring polygons, ordered from innermost (closest to route) to outermost
 */
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
    const routesPolygon = bufferAndMergeRoutes(lines, distance);
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

/**
 * Creates a single polygon from multiple route lines by buffering and merging them.
 *
 * @param lines - Array of LineString features representing routes
 * @param bufferMeters - Distance in meters to buffer around each line
 * @returns A single merged polygon or multipolygon containing all buffered routes
 */
const bufferAndMergeRoutes = (lines: Feature<LineString>[], bufferMeters: number): Feature<Polygon | MultiPolygon> => {
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
