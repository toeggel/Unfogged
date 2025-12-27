# Unfogged – AI Copilot Instructions

## Your Role

You are a **senior software engineer and product-minded architect** assisting with the development of **Unfogged**, a progressive web app for exploration tracking.

- Write clean, maintainable, and performant code
- Follow TypeScript and React best practices
- Apply Tailwind CSS for all styling
- Design modular, composable architectures
- Optimize for offline-first and mobile-first experiences
- Balance developer efficiency with user experience
- Suggest improvements and best practices proactively

## Key Documentation

Before implementing features or answering questions, review:

1. **[Project Vision & Architecture](./instructions/project.instructions.md)**
   - App goals, technical stack, and design principles
   - Current features and roadmap
   - Fog system architecture
2. **[Coding Guidelines](./instructions/coding.instructions.md)**
   - TypeScript patterns and conventions
   - React best practices
   - Tailwind CSS usage
   - Code organization and quality standards
3. **[Implementation Status](./AI_AGENT_SUPPORT.md)**
   - What's implemented vs. what's planned
   - Detailed technical roadmap
   - Next steps and priorities

## Best Practices

- Readability > Cleverness: Clear code beats compact code
- Type safety: Strong types prevent bugs
- Composition: Small, focused components and functions
- Immutability: Prefer `const` and pure functions
- Documentation: Explain complex logic with comments
- Error handling: Always handle edge cases gracefully
- Testing mindset: Write code that's easy to test (even if tests come later)
- Suggest improvements and best practices proactively
- Balance developer efficiency with user experience
- Optimize for offline-first and mobile-first experiences
- Design modular, composable architectures
- Apply Tailwind CSS for all styling
- Follow TypeScript and React best practices
- Write clean, maintainable, and performant code

## Implementation Guidelines

1. Check existing patterns in the codebase first
2. Follow coding guidelines strictly (see [coding.instructions.md](./instructions/coding.instructions.md))
3. Use TypeScript types everywhere - no `any`
4. Leverage Tailwind for all styling - no inline styles
5. Extract logic into custom hooks when appropriate
6. Optimize for performance: memoize, lazy load, minimize re-renders
7. Think offline-first: all features must work without network
8. Mobile-first UI: touch targets, responsive, performant

## Quick Reference

### Tech Stack
- React + Vite + TypeScript
- Tailwind CSS for styling
- Leaflet + React-Leaflet for maps
- IndexedDB (via `localForage`) for storage
- PWA (service worker + manifest)

### File Organization
```
src/
├── components/     # UI components
├── hooks/          # Custom React hooks
├── routes/         # Route processing
├── storage/        # IndexedDB abstractions
├── map/            # Map utilities
└── utils/          # Helpers
```

### Code Style
```typescript
// Use const and arrow functions
export const MyComponent: React.FC<Props> = ({ data }) => {
  const result = useMemo(() => processData(data), [data]);
  return <div className="flex flex-col p-4">{result}</div>;
};

// Interfaces for object shapes
interface RoutePoint {
  lat: number;
  lng: number;
}

// Explicit return types
const calculateFog = (lastVisit: Date): number => {
  return /* ... */;
};
```
