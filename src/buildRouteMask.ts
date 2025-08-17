// geo/buildRouteMask.ts
import { lineString, featureCollection, polygon } from "@turf/helpers";
import { buffer, Options } from "@turf/buffer";
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
export function buildRouteMask(
  routes: StrollRoute[],
  bufferMeters: number,
  numberOfLayers: number = 2, // number of route layers to buffer, at least 1
): {
  mask: Feature<Polygon | MultiPolygon> | null;
  routes: (Feature<Polygon | MultiPolygon> | null)[];
} {
  const lines: Feature<LineString>[] = createLine(routes);

  if (lines.length === 0) {
    return { mask: null, routes: [] };
  }

  let mainRouteBuffer = buffer(
    featureCollection(lines),
    bufferMeters,
    defaultBufferSettings,
  ) as FeatureCollection<Polygon>;
  const mainRoutePolygon = union(mainRouteBuffer) as Feature<Polygon | MultiPolygon>;
  const worldMask = difference(featureCollection([world, mainRoutePolygon]));

  // 2) buffer lines (meters)
  let buffers: (Feature<Polygon | MultiPolygon> | null)[] = createBufferedRoutes(
    bufferMeters,
    numberOfLayers,
    lines,
    mainRoutePolygon,
  );

  return {
    mask: worldMask,
    routes: buffers,
  };
}

function createBufferedRoutes(
  bufferMeters: number,
  numberOfLayers: number,
  lines: Feature<LineString>[],
  mainRoutePolygon: Feature<Polygon | MultiPolygon>,
) {
  let buffers: (Feature<Polygon | MultiPolygon> | null)[] = [];
  let bufferedRoutes: Feature<Polygon | MultiPolygon>[] = [];
  let bufferMeterStep = bufferMeters / numberOfLayers;
  for (let i = 0; i < numberOfLayers; i++) {
    const buffered = buffer(
      featureCollection(lines),
      bufferMeterStep * (i + 1),
      defaultBufferSettings,
    ) as FeatureCollection<Polygon>;

    const bufferedRoute = union(buffered) as Feature<Polygon | MultiPolygon>;
    bufferedRoutes.push(bufferedRoute);
  }

  buffers = bufferedRoutes.map((b, i) =>
    difference(featureCollection([b, i > 0 ? bufferedRoutes[i - 1] : mainRoutePolygon])),
  );
  return buffers;
}

function createLine(routes: StrollRoute[]) {
  return routes
    .map((r) => r.points.map((p) => [p.lng, p.lat] as [number, number]))
    .filter((coords) => coords.length >= 2)
    .map((coords) => lineString(coords));
}
