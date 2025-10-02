export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  collection: "Eid Collection" | "Bakra Eid Specials" | "14 August Independence Collection" | "Birthday Specials";
  rating: number;
  reviews: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "eid-1",
    name: "Eid Bloom Kurta",
    price: 6990,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
    sizes: ["S", "M", "L", "Kids"],
    collection: "Eid Collection",
    rating: 4.8,
    reviews: 61,
  },
  {
    id: "eid-2",
    name: "Henna Night Set",
    price: 8990,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop",
    sizes: ["S", "M", "L"],
    collection: "Eid Collection",
    rating: 4.7,
    reviews: 41,
  },
  {
    id: "bakra-1",
    name: "Bakra Eid Pastels",
    price: 7490,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
    sizes: ["S", "M", "L", "Kids"],
    collection: "Bakra Eid Specials",
    rating: 4.6,
    reviews: 33,
  },
  {
    id: "pak-1",
    name: "Azadi Green Dress",
    price: 6590,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop",
    sizes: ["S", "M", "L", "Kids"],
    collection: "14 August Independence Collection",
    rating: 4.5,
    reviews: 28,
  },
  {
    id: "bday-1",
    name: "Birthday Confetti Frock",
    price: 5590,
    image: "https://images.unsplash.com/photo-1530968464161-8f0b4ef9c583?q=80&w=1200&auto=format&fit=crop",
    sizes: ["Kids"],
    collection: "Birthday Specials",
    rating: 4.9,
    reviews: 72,
  },
  {
    id: "bday-2",
    name: "Hand-painted Bow Dress",
    price: 6290,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
    sizes: ["Kids"],
    collection: "Birthday Specials",
    rating: 4.7,
    reviews: 19,
  },
];

export const COLLECTIONS = [
  "Eid Collection",
  "Bakra Eid Specials",
  "14 August Independence Collection",
  "Birthday Specials",
] as const;

export const SIZES = ["S", "M", "L", "Kids"] as const;
