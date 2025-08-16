# Unfogged PWA

Unfogged is a Progressive Web App (PWA) designed to help users explore their surroundings by visualizing areas they have visited over time. The app features a "fog of war"-style map that reveals visited areas while keeping unvisited areas obscured, encouraging mindful exploration.

## Project Structure

```
unfogged
├── public
│   ├── favicon.svg          # Favicon for the application
│   ├── index.html           # Main HTML file
│   └── manifest.webmanifest  # PWA metadata
├── src
│   ├── assets               # Static assets (images, fonts)
│   ├── components           # React components
│   │   ├── MapView.tsx     # Component for rendering the Leaflet map
│   │   └── Header.tsx       # Component for the application header
│   ├── hooks                # Custom hooks
│   │   └── useGeolocation.ts # Hook for managing geolocation
│   ├── styles               # Stylesheets
│   │   └── tailwind.css     # Tailwind CSS styles
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point for the React application
│   └── types                # TypeScript types and interfaces
│       └── index.ts
├── .gitignore               # Git ignore file
├── index.html               # Duplicate of public/index.html for local development
├── package.json             # npm configuration file
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Getting Started

To get started with the Unfogged PWA, follow these steps:

1. **Clone the repository:**

   ```
   git clone <repository-url>
   cd unfogged-pwa
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Run the development server:**

   ```
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Features

- Track user location and visualize visited areas on a map.
- Fog of war effect to highlight unexplored regions.
- Offline-first capabilities using IndexedDB.
- Mobile-first design with a focus on user experience.

## Future Enhancements

- Background sync for location data.
- Cloud backup options for user data.
- Gamification elements to encourage exploration.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
