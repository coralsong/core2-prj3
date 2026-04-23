import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const eggType = v.union(
  v.literal("brown"),
  v.literal("white"),
  v.literal("quail"),
  v.literal("ostrich"),
  v.literal("vegetarian"),
);

export default defineSchema({
  eggPrices: defineTable({
    storeName: v.string(),
    eggType,
    price: v.number(),
    latitude: v.number(),
    longitude: v.number(),
  }).index("by_eggType", ["eggType"]),
});
