import { StrollRoute, RoutePoint } from "./visitedPlaces";

/** Remove consecutive duplicates (exact same lat/lng) */
const dedupeConsecutivePoints = (points: RoutePoint[]): RoutePoint[] => {
  return points.filter((p, i, arr) => {
    if (i === 0) return true;
    const prev = arr[i - 1];
    return p.lat !== prev.lat || p.lng !== prev.lng;
  });
};

/**
 * Parses a GPX file (as string or XMLDocument) and returns a StrollRoute object.
 * Only extracts the first <trk> and its <trkseg> points.
 */
export const parseGpxToStrollRoute = async (
  gpxContent: string,
  routeName = "Imported GPX",
): Promise<StrollRoute> => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxContent, "application/xml");

  const name = xml.querySelector("trk > name")?.textContent?.trim() || routeName;
  const description = xml.querySelector("trk > desc")?.textContent?.trim() || undefined;

  const points: RoutePoint[] = [];
  xml.querySelectorAll("trkpt").forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "");
    const lng = parseFloat(pt.getAttribute("lon") || "");
    const time = pt.querySelector("time")?.textContent;
    points.push({
      lat,
      lng,
      timestamp: time ? Date.parse(time) : undefined,
    });
  });

  // 🔹 Clean up consecutive duplicates
  const cleanedPoints = dedupeConsecutivePoints(points);

  return {
    name,
    description,
    points: cleanedPoints,
  };
};
