import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProject = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      bannerUrl: args.bannerUrl,
      isPublic: args.isPublic,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getUserProjects = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Get component count for each project
    const projectsWithComponentCount = await Promise.all(
      projects.map(async (project) => {
        const componentCount = await ctx.db
          .query("components")
          .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
          .collect();
        
        return {
          ...project,
          componentCount: componentCount.length,
        };
      })
    );

    return projectsWithComponentCount;
  },
});

export const getPublicProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();

    // Get component count for each project
    const projectsWithComponentCount = await Promise.all(
      projects.map(async (project) => {
        const componentCount = await ctx.db
          .query("components")
          .withIndex("by_projectId", (q) => q.eq("projectId", project._id))
          .collect();
        
        return {
          ...project,
          componentCount: componentCount.length,
        };
      })
    );

    return projectsWithComponentCount;
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    await ctx.db.patch(projectId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Delete all components in the project first
    const components = await ctx.db
      .query("components")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const component of components) {
      await ctx.db.delete(component._id);
    }

    // Delete the project
    await ctx.db.delete(args.projectId);
  },
});