export const DEFAULT_CENTER = [40.7359, -73.9911];

export const MAP_BOUNDS = [
  [40.7003, -74.02],
  [40.882, -73.907],
];

export const EGG_TYPES = [
  { value: "all", label: "All Eggs", tone: "all" },
  { value: "brown", label: "Brown Eggs", tone: "brown" },
  { value: "white", label: "White Eggs", tone: "white" },
  { value: "quail", label: "Quail Eggs", tone: "quail" },
  { value: "ostrich", label: "Ostrich Eggs", tone: "ostrich" },
  { value: "vegetarian", label: "Vegetarian Eggs", tone: "vegetarian" },
];

export const DEMO_PINS = [
  {
    _id: "demo-brown",
    storeName: "Union Square Market",
    price: 7.5,
    eggType: "brown",
    latitude: 40.7374,
    longitude: -73.9902,
    _creationTime: Date.now() - 1000 * 60 * 60,
  },
  {
    _id: "demo-white",
    storeName: "Village Pantry",
    price: 5.99,
    eggType: "white",
    latitude: 40.7291,
    longitude: -73.9981,
    _creationTime: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    _id: "demo-quail",
    storeName: "East Market Goods",
    price: 8.25,
    eggType: "quail",
    latitude: 40.7284,
    longitude: -73.9849,
    _creationTime: Date.now() - 1000 * 60 * 60 * 7,
  },
];
