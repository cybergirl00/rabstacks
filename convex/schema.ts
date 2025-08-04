import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    github: v.optional(v.string()),
    twitter: v.optional(v.string()),
    isPremium: v.boolean(),
    followers: v.array(v.string()),
    following: v.array(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  projects: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  components: defineTable({
    projectId: v.string(),
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    framework: v.string(),
    code: v.string(),
    screenshotUrl: v.optional(v.string()),
    isPublic: v.boolean(),
    isForSale: v.boolean(),
    price: v.optional(v.number()),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_userId", ["userId"])
    .index("by_public", ["isPublic"]),

  purchases: defineTable({
    buyerId: v.string(),
    componentId: v.string(),
    sellerId: v.string(),
    amount: v.number(),
    createdAt: v.number(),
  })
    .index("by_buyerId", ["buyerId"])
    .index("by_sellerId", ["sellerId"]),

  subscriptions: defineTable({
    userId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.number(),
    flutterwaveCustomerId: v.optional(v.string()),
  }).index("by_userId", ["userId"]),
});