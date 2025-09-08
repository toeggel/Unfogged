import { useEffect, useState } from "react";
import { StrollRoute } from "../buildRouteMask";
import { parseGpxToStrollRoute } from "../routes/gpxImport";

/**
 * Loads and parses a list of GPX files into StrollRoute objects.
 * Ensures loading only happens once (even in React Strict Mode).
 */
export const useImportedRoutes = (files: string[]) => {
  const [importedRoutes, setImportedRoutes] = useState<StrollRoute[]>([]);

  useEffect(() => {
    Promise.all(
      files.map((file) =>
        fetch(file)
          .then((res) => res.text())
          .then((gpxText) => parseGpxToStrollRoute(gpxText, file)),
      ),
    )
      .then((routes) => setImportedRoutes(routes))
      .catch((err) => {
        console.error("Failed to load GPX files:", err);
        setImportedRoutes([]);
      });
  }, [files]);

  return importedRoutes;
};
