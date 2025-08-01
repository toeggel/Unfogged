/**
 * Parses a GPX file (as string or XMLDocument) and returns a StrollRoute object.
 * Only extracts the first <trk> and its <trkseg> points.
 */
import { StrollRoute, RoutePoint } from './visitedPlaces';

export async function parseGpxToStrollRoute(gpxContent: string, routeName = "Imported GPX"): Promise<StrollRoute> {
    // Parse the GPX XML
    const parser = new DOMParser();
    const xml = parser.parseFromString(gpxContent, "application/xml");

    // Extract route name/desc if present
    const name = xml.querySelector("trk > name")?.textContent?.trim() || routeName;
    const description = xml.querySelector("trk > desc")?.textContent?.trim() || undefined;

    // Extract all <trkpt> elements
    const points: RoutePoint[] = [];
    xml.querySelectorAll("trkpt").forEach(pt => {
        const lat = parseFloat(pt.getAttribute("lat") || "");
        const lng = parseFloat(pt.getAttribute("lon") || "");
        const time = pt.querySelector("time")?.textContent;
        points.push({
            lat,
            lng,
            timestamp: time ? Date.parse(time) : undefined
        });
    });

    return {
        name,
        description,
        points
    };
}