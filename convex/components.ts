import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createComponent = mutation({
  args: {
    projectId: v.id("projects"),
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    framework: v.string(),
    code: v.string(),
    editedCode: v.string(),
    screenshotUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    isForSale: v.boolean(),
    price: v.optional(v.number()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("components", {
      projectId: args.projectId,
      userId: args.userId,
      name: args.name,
      description: args.description,
      framework: args.framework,
      code: args.code,
      editedCode: args.editedCode,
      screenshotUrl: args.screenshotUrl,
      isPublic: args.isPublic,
      isForSale: args.isForSale,
      price: args.price,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getProjectComponents = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("components")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getPublicComponents = query({
  args: {
    framework: v.optional(v.string()),
    isForSale: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("components")
      .withIndex("by_public", (q) => q.eq("isPublic", true));

    const components = await query.collect();

    // Filter by framework if specified
    let filtered = components;
    if (args.framework) {
      filtered = components.filter((c) => c.framework === args.framework);
    }

    // Filter by sale status if specified
    if (args.isForSale !== undefined) {
      filtered = filtered.filter((c) => c.isForSale === args.isForSale);
    }

    // Apply limit if specified
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

export const getComponent = query({
  args: { componentId: v.id("components") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.componentId);
  },
});

export const updateComponent = mutation({
  args: {
    componentId: v.id("components"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    framework: v.optional(v.string()),
    code: v.optional(v.string()),
    screenshotUrl: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    isForSale: v.optional(v.boolean()),
    price: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { componentId, ...updates } = args;
    await ctx.db.patch(componentId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteComponent = mutation({
  args: { componentId: v.id("components") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.componentId);
  },
});