import { FogRing } from "../routes/buildRouteMask";

export const splitArrayIntoChunks = (routes: FogRing[], chunks: number, startDate?: Date): FogRing[][] => {
  if (chunks <= 0) {
    return [];
  }

  // If no startDate provided, split by array size
  if (!startDate) {
    const result: FogRing[][] = [];
    const chunkSize = Math.ceil(routes.length / chunks);

    for (let i = 0; i < routes.length; i += chunkSize) {
      result.push(routes.slice(i, i + chunkSize));
    }

    return result;
  }

  // Split by date ranges
  const now = new Date();
  const startTime = startDate.getTime();
  const endTime = now.getTime();
  const totalDuration = endTime - startTime;
  const chunkDuration = totalDuration / chunks;

  // Create N empty chunks
  const result: FogRing[][] = Array.from({ length: chunks }, () => []);

  // Assign each route to the appropriate chunk based on its timestamp
  routes.forEach((route) => {
    if (!route.date) {
      // Routes without timestamp go to the last chunk
      result[chunks - 1].push(route);
      return;
    }

    const routeTime = route.date.getTime();

    // Calculate which chunk this route belongs to
    const timeSinceStart = routeTime - startTime;
    let chunkIndex = Math.floor(timeSinceStart / chunkDuration);

    // Clamp to valid range [0, chunks-1]
    chunkIndex = Math.max(0, Math.min(chunks - 1, chunkIndex));

    result[chunkIndex].push(route);
  });

  return result.reverse();
};
