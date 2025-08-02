// components/InverseFogOverlay.tsx
import React, { useEffect, useState } from 'react';
import { useMap, ImageOverlay } from 'react-leaflet';
import * as turf from '@turf/turf';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

interface InverseFogOverlayProps {
  polygons: {
    coordinates: [number, number][][];
  }[];
}

const canvasSize = 256; // resolution of the canvas (adjust for performance vs quality)

export const InverseFogOverlay: React.FC<InverseFogOverlayProps> = ({ polygons }) => {
  const map = useMap();
  const bounds = map.getBounds();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [renderBounds, setRenderBounds] = useState<any>(null);

  useEffect(() => {
    if (!map) return;

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(canvasSize, canvasSize);
    const densityMap = new Uint8Array(canvasSize * canvasSize);

    // Pre-convert polygon coordinates to turf-compatible polygons
    const turfPolygons = polygons.flatMap(({ coordinates }) =>
      coordinates.map(ring =>
        turf.polygon([[...ring.map(([lat, lng]) => [lng, lat])]])
      )
    );

    // For each pixel, check if inside any polygon
    for (let y = 0; y < canvasSize; y++) {
      for (let x = 0; x < canvasSize; x++) {
        const lng = bounds.getWest() + (x / canvasSize) * (bounds.getEast() - bounds.getWest());
        const lat = bounds.getNorth() - (y / canvasSize) * (bounds.getNorth() - bounds.getSouth());
        const pt = turf.point([lng, lat]);

        let overlapCount = 0;
        for (const poly of turfPolygons) {
          if (booleanPointInPolygon(pt, poly)) {
            overlapCount++;
          }
        }

        const idx = y * canvasSize + x;
        densityMap[idx] = overlapCount;
      }
    }

    // Get max count to normalize alpha
    const maxDensity = Math.max(...densityMap);

    // Paint the canvas: inverse transparency based on overlap
    for (let i = 0; i < densityMap.length; i++) {
      const alpha = densityMap[i] > 0
        ? Math.floor(255 * (1 - densityMap[i] / maxDensity))
        : 255;

      const px = i * 4;
      imageData.data[px + 0] = 0;   // Red
      imageData.data[px + 1] = 0;   // Green
      imageData.data[px + 2] = 255; // Blue
      imageData.data[px + 3] = alpha; // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    setImageUrl(canvas.toDataURL());
    setRenderBounds(bounds);
  }, [polygons, bounds, map]);

  if (!imageUrl || !renderBounds) return null;

  return <ImageOverlay url={imageUrl} bounds={renderBounds} opacity={1} />;
};
