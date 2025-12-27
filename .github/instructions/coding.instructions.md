# Coding Guidelines

> **Clean, simple, and consistent code that scales.**

## Core Principles

1. **Readability first**: Code is read 10x more than written
2. **Type safety**: Leverage TypeScript's full power
3. **Composition**: Small, focused, reusable units
4. **Immutability**: Prefer `const` and pure functions
5. **Explicit over implicit**: Clear intent beats cleverness

## TypeScript Rules

### Variables & Functions
```typescript
// Use const for immutable bindings
const FOG_RADIUS = 40;
const userLocation = { lat: 47.4, lng: 8.5 };

// Use arrow functions stored in const
const calculateDistance = (a: Point, b: Point): number => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

// Avoid function declarations
function calculateDistance(a, b) { /* ... */ }

// Avoid let unless reassignment is necessary
let mutableCount = 0; // Only if truly needed
```

### Types & Interfaces
```typescript
// Use interfaces for object shapes
interface RoutePoint {
  lat: number;
  lng: number;
  timestamp?: Date;
}

// Use object notation for inline types
const config: { radius: number; levels: number } = {
  radius: 40,
  levels: 3,
};

// Avoid type aliases for simple objects
type RoutePoint = { lat: number; lng: number }; // Use interface instead

// Use type for unions, intersections, utilities
type FogLevel = 'clear' | 'light' | 'medium' | 'full';
type RouteWithMetadata = Route & { metadata: Metadata };
```

### Exports
```typescript
// Export directly where possible
export const MyComponent: React.FC = () => { /* ... */ };
export const helper = () => { /* ... */ };
export interface MyInterface { /* ... */ }

// Avoid default exports (harder to refactor)
export default MyComponent;
```

### Type Annotations
```typescript
// Explicit return types for functions
export const getRoute = async (id: string): Promise<Route | null> => {
  // ...
};

// Type function parameters
const processPoint = (point: RoutePoint, index: number): void => {
  // ...
};

// Use strong types over 'any'
const data: unknown = await fetch(url); // Then type-guard it
```

## React Best Practices

### Component Structure
```typescript
// Functional components with explicit typing
export const MapView: React.FC = () => {
  // Hooks at the top
  const [state, setState] = useState<State>(initialState);
  const data = useSomeHook();
  
  // Effects and callbacks
  useEffect(() => {
    // side effect
  }, [dependencies]);
  
  const handleClick = (): void => {
    // handler
  };
  
  // Render
  return <div>...</div>;
};
```

### Hooks
```typescript
// Custom hooks follow `use*` naming
export const useGeolocation = (): GeolocationResult => {
  const [location, setLocation] = useState<Location | null>(null);
  // ...
  return { location, error };
};

// Extract complex logic into custom hooks
const { routes, loading } = useImportedRoutes(gpxFiles);
```

### Props
```typescript
// Define props interface
interface MapViewProps {
  center: LatLng;
  zoom?: number; // Optional with ?
  onLocationChange: (loc: LatLng) => void; // Callbacks
}

export const MapView: React.FC<MapViewProps> = ({ 
  center, 
  zoom = 13, 
  onLocationChange 
}) => {
  // ...
};
```

## Tailwind CSS

### Utility Classes
```typescript
// Use Tailwind utilities directly
<div className="flex flex-col h-screen bg-gray-900">
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">
    Track Location
  </button>
</div>

// Group related utilities logically
className="
  flex items-center justify-between
  p-4 m-2
  bg-white shadow-lg rounded-md
  hover:shadow-xl transition-shadow
"

// Avoid inline styles
style={{ padding: '16px', backgroundColor: 'blue' }} // Use Tailwind
```

### Responsive Design
```typescript
// Mobile-first responsive classes
className="w-full md:w-1/2 lg:w-1/3"
className="text-sm md:text-base lg:text-lg"
```

## Code Organization

### File Naming
- Components: `PascalCase.tsx` (e.g., `MapView.tsx`)
- Hooks: `camelCase.ts` (e.g., `useGeolocation.ts`)
- Utils: `kebab-case.ts` (e.g., `array-helper.ts`)
- Types: Co-locate or in `types.ts`

### Imports Order
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

// 2. Internal modules
import { useGeolocation } from '../hooks/useGeolocation';
import { RoutePoint } from '../types';

// 3. Styles
import './styles.css';
```

### Folder Structure
```
components/
  MapView.tsx          # Main component
  MapView.test.tsx     # Tests (future)

hooks/
  useGeolocation.ts    # Single purpose per file
  
utils/
  array-helper.ts      # Pure functions
```

## Code Quality

### Naming Conventions
```typescript
// Descriptive names
const calculateFogOpacity = (lastVisit: Date): number => { /* ... */ };
const isLocationInViewport = (loc: LatLng, bounds: Bounds): boolean => { /* ... */ };

// Avoid abbreviations and unclear names
const calc = (d) => { /* ... */ }; // Bad
const temp = []; // What is this?
```

### Comments
```typescript
// Explain WHY, not WHAT
// Throttle to 1 update per second to preserve battery
const LOCATION_UPDATE_INTERVAL = 1000;

// Document complex algorithms
/**
 * Calculates fog state based on time decay.
 * Uses exponential falloff: opacity = 1 - e^(-t/decay_constant)
 */
const calculateFogState = (lastVisit: Date): FogState => {
  // ...
};

// Don't state the obvious
const x = 5; // Set x to 5 (obvious, remove comment)
```

### Error Handling
```typescript
// Handle errors gracefully
try {
  const route = await loadRoute(id);
  if (!route) {
    console.warn(`Route ${id} not found`);
    return null;
  }
  return route;
} catch (error) {
  console.error('Failed to load route:', error);
  throw new Error(`Route loading failed: ${error.message}`);
}

// Use type guards for unknown data
const isRoutePoint = (obj: unknown): obj is RoutePoint => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'lat' in obj &&
    'lng' in obj
  );
};
```

## Performance

### Memoization
```typescript
// Memoize expensive computations
const fogMask = useMemo(
  () => buildRouteMask(routes, radius, levels),
  [routes, radius, levels]
);

// Memoize callbacks passed to children
const handleLocationUpdate = useCallback((loc: LatLng) => {
  saveLocation(loc);
}, []);
```

### Lazy Loading
```typescript
// Lazy load large dependencies
const HeatmapLayer = lazy(() => import('./HeatmapLayer'));
```

## Related Documentation

- [Project Vision](./project.instructions.md) – Architecture and goals
- [AI Agent Support](../AI_AGENT_SUPPORT.md) – Current implementation status

