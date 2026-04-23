import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";


const query = queryGeneric;
const mutation = mutationGeneric;

const eggType = v.union(
  v.literal("brown"),
  v.literal("white"),
  v.literal("quail"),
  v.literal("ostrich"),
  v.literal("vegetarian"),
);

export const list = query({
  args: {
    eggType: v.optional(eggType),
  },
  handler: async (ctx, args) => {
    if (args.eggType) {
      return await ctx.db
        .query("eggPrices")
        .withIndex("by_eggType", (q) => q.eq("eggType", args.eggType))
        .order("desc")
        .take(200);
    }

    return await ctx.db.query("eggPrices").order("desc").take(200);
  },
});

export const create = mutation({
  args: {
    storeName: v.string(),
    eggType,
    price: v.number(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("eggPrices", {
      storeName: args.storeName.trim(),
      eggType: args.eggType,
      price: Math.round(args.price * 100) / 100,
      latitude: args.latitude,
      longitude: args.longitude,
    });
  },
});
