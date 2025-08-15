export interface VisitedPlace {
    lat: number;
    lng: number;
    lastVisited: number; // Unix timestamp
    visitCount: number;
}

export const MOCK_VISITED_PLACES: VisitedPlace[] = [
    { lat: 47.3769, lng: 8.5417, lastVisited: Date.now() - 1000 * 60 * 60, visitCount: 5 },
    { lat: 47.378, lng: 8.54, lastVisited: Date.now() - 1000 * 60 * 60 * 24, visitCount: 2 },
    { lat: 47.379, lng: 8.538, lastVisited: Date.now() - 1000 * 60 * 60 * 48, visitCount: 1 }
];

export interface RoutePoint {
    lat: number;
    lng: number;
    timestamp?: number; // Optional: when the user passed this point
}

export interface StrollRoute {
    name: string;
    description?: string;
    points: RoutePoint[];
}

export const MOCK_STROLL_ROUTES: StrollRoute[] = [
    {
        name: "Old Town Loop",
        description: "A classic stroll through Zurich's historic Altstadt.",
        points: [
            { lat: 47.3739, lng: 8.5451 },
            { lat: 47.3747, lng: 8.5416 },
            { lat: 47.3769, lng: 8.5417 },
            { lat: 47.3782, lng: 8.5433 },
            { lat: 47.3770, lng: 8.5460 },
            { lat: 47.3739, lng: 8.5451 }
        ]
    },
    {
        name: "Lake Promenade",
        description: "A scenic walk along Lake Zurich.",
        points: [
            { lat: 47.3667, lng: 8.5450 },
            { lat: 47.3678, lng: 8.5482 },
            { lat: 47.3695, lng: 8.5501 },
            { lat: 47.3712, lng: 8.5515 },
            { lat: 47.3730, lng: 8.5520 }
        ]
    },
    {
        name: "University Hill",
        description: "Up the hill to ETH and the university quarter.",
        points: [
            { lat: 47.3769, lng: 8.5417 },
            { lat: 47.3785, lng: 8.5456 },
            { lat: 47.3801, lng: 8.5472 },
            { lat: 47.3817, lng: 8.5488 }
        ]
    },
];