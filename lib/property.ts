export const AIRBNB_URL =
  "https://www.airbnb.com/rooms/1409091642899578717";
export const DIRECT_BOOKING_URL =
  "https://app-apac.thebookingbutton.com/properties/villazenoaretedirect";
export const WHATSAPP_URL =
  "https://wa.me/628113807533?text=Hello%20Nusa%20Nova%2C%20I%27d%20like%20to%20enquire%20about%20Villa%20Zeno%20Arete.";

export type PropertyCategory =
  | "zeus"
  | "athena"
  | "apollo"
  | "artemis"
  | "ares"
  | "selene"
  | "pools"
  | "living"
  | "dining"
  | "wellness";

export interface PropertyPhoto {
  id: string;
  index: number;
  filename: string;
  thumb: string;
  full: string;
  category: PropertyCategory;
  categoryLabel: string;
  description: string;
  alt: string;
  visible: boolean;
  order: number;
}

export const categoryLabels: Record<PropertyCategory, string> = {
  zeus: "Zeus",
  athena: "Athena",
  apollo: "Apollo",
  artemis: "Artemis",
  ares: "Ares",
  selene: "Selene",
  pools: "Pools & outdoor",
  living: "Living & cinema",
  dining: "Dining & kitchen",
  wellness: "Training & recovery",
};

const categoryPhotoNumbers: Record<PropertyCategory, number[]> = {
  zeus: [29, 30, 31, 36, 37, 38],
  athena: [46, 47, 48, 49, 51],
  apollo: [53, 69, 70, 76],
  artemis: [24, 25, 26, 27],
  ares: [41, 42, 44, 65, 78],
  selene: [11, 12, 23, 43],
  pools: [1, 2, 5, 8, 9, 14, 15, 16, 19, 20, 21, 22, 34, 35, 45, 50, 56, 58, 64, 66, 71, 74, 75, 91, 92, 95],
  living: [4, 6, 7, 17, 32, 33, 39, 61, 67, 72, 93, 94],
  dining: [10, 13, 18, 28, 62, 63, 68, 89, 90],
  wellness: [3, 40, 52, 54, 55, 57, 59, 60, 73, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 96, 97, 98],
};

const categoryByPhoto = new Map<number, PropertyCategory>();
Object.entries(categoryPhotoNumbers).forEach(([category, numbers]) => {
  numbers.forEach((number) => categoryByPhoto.set(number, category as PropertyCategory));
});

function photoPath(index: number, width: 480 | 960 | 1440) {
  return `/images/airbnb/photo-${String(index).padStart(3, "0")}-${width}.webp`;
}

export const propertyPhotos: PropertyPhoto[] = Array.from(
  { length: 98 },
  (_, offset) => {
    const index = offset + 1;
    const category = categoryByPhoto.get(index);
    if (!category) {
      throw new Error(`Missing category for Airbnb photo ${index}`);
    }
    const categoryLabel = categoryLabels[category];
    return {
      id: `airbnb-${String(index).padStart(3, "0")}`,
      index,
      filename: `photo-${String(index).padStart(3, "0")}.webp`,
      thumb: photoPath(index, 480),
      full: photoPath(index, 1440),
      category,
      categoryLabel,
      description: categoryLabel,
      alt: `Villa Zeno Arete ${categoryLabel.toLowerCase()}, photograph ${index}`,
      visible: true,
      order: offset,
    };
  },
);

export function getPhoto(index: number) {
  const photo = propertyPhotos[index - 1];
  if (!photo) throw new Error(`Unknown property photo ${index}`);
  return photo;
}

export function getCategoryPhotos(category: PropertyCategory) {
  return propertyPhotos.filter((photo) => photo.category === category);
}

export const suites = [
  {
    key: "zeus" as const,
    number: 1,
    room: "Master Suite 1",
    name: "Zeus",
    meaning: "Supreme strength and mastery",
    quote: "Strength is born in mastery over the self.",
    copy: "The principal suite pairs a king bed with its own living zone, immersive sound, generous outdoor access and the villa's most commanding sense of scale.",
    photoNumbers: [29, 30, 31],
  },
  {
    key: "athena" as const,
    number: 4,
    room: "Master Suite 2",
    name: "Athena",
    meaning: "Wisdom, beauty and strategic intelligence",
    quote: "True power lies not in force, but in wisdom.",
    copy: "A second master suite designed around calm proportions, warm timber and a private place to pause before the day begins.",
    photoNumbers: [46, 47, 48],
  },
  {
    key: "apollo" as const,
    number: 2,
    room: "Suite 3",
    name: "Apollo",
    meaning: "Light, music, healing and masculine beauty",
    quote: "Bring light to the darkness, and music to the silence.",
    copy: "Sunlit and composed, Apollo brings the garden into the room and gives every guest a king-size retreat of their own.",
    photoNumbers: [53, 69, 70],
  },
  {
    key: "artemis" as const,
    number: 3,
    room: "Suite 4",
    name: "Artemis",
    meaning: "Independence, wildness and feminine strength",
    quote: "Run wild with purpose; walk soft with power.",
    copy: "Light fabrics, natural textures and an immediate connection to the outdoors give Artemis its independent character.",
    photoNumbers: [24, 25, 26],
  },
  {
    key: "ares" as const,
    number: 5,
    room: "Suite 5",
    name: "Ares",
    meaning: "Raw masculine energy and relentless intent",
    quote: "Victory favors the relentless.",
    copy: "Deeper tones and a cinematic atmosphere make Ares a private counterpoint to the villa's bright social spaces.",
    photoNumbers: [44, 42, 65],
  },
  {
    key: "selene" as const,
    number: 6,
    room: "Suite 6",
    name: "Selene",
    meaning: "Calmness, mystery and reflection",
    quote: "In stillness, you will find your true reflection.",
    copy: "Quiet materials and a softer mood shape Selene into a restful final chapter of the six-suite collection.",
    photoNumbers: [12, 11, 23],
  },
];

export const sharedSpaces = [
  {
    category: "pools" as const,
    title: "Two pools, one continuous playground",
    copy: "Glass-bottom water, a private plunge pool, swim-up social spaces and the slide from the master suite turn the courtyard into the villa's natural centre.",
    photoNumber: 35,
    detail: "Two pools · slide · swim-up bar",
  },
  {
    category: "living" as const,
    title: "Living spaces with room for everyone",
    copy: "Open lounges, a cinema-style TV room and Sonos throughout the villa make it easy to move between conversation, film and music without competing for space.",
    photoNumber: 61,
    detail: "Cinema · Sonos · indoor-outdoor lounges",
  },
  {
    category: "dining" as const,
    title: "Dining shaped around the group",
    copy: "A generous kitchen, island seating, indoor and outdoor tables, plus chef service on request support everything from breakfast after training to long private dinners.",
    photoNumber: 90,
    detail: "Chef service · BBQ · indoor and outdoor dining",
  },
  {
    category: "wellness" as const,
    title: "Train, recover, repeat",
    copy: "A proper private gym sits alongside the sauna, ice bath, jacuzzi and outdoor shower, so training and recovery are part of the stay rather than an off-site appointment.",
    photoNumber: 98,
    detail: "Gym · sauna · ice bath · jacuzzi",
  },
];
