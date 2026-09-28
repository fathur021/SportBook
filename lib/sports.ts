export type SportCategory = {
  slug: string;
  name: string;
  description: string;
  tag: string;
  highlight?: boolean;
  venueCount: number;
};

export const sportCategories: SportCategory[] = [
  { slug: "futsal", name: "Futsal", description: "5v5 Indoor & Vinyl", tag: "Vinyl", venueCount: 42 },
  { slug: "padel", name: "Padel", description: "Panoramic Glass Courts", tag: "Hot", highlight: true, venueCount: 28 },
  { slug: "badminton", name: "Badminton", description: "BWF Standard Mat", tag: "BWF", venueCount: 64 },
  { slug: "basketball", name: "Basketball", description: "Hardwood Indoor", tag: "FIBA", venueCount: 19 },
  { slug: "volleyball", name: "Volleyball", description: "Sand & Interlock", tag: "Sand", venueCount: 14 },
  { slug: "tennis", name: "Tennis", description: "Hard Court & Clay", tag: "Hard/Clay", venueCount: 31 },
];