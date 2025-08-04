"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { ComponentCard } from "@/components/component-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

const FRAMEWORKS = [
  "All",
  "React",
  "Vue",
  "Angular",
  "HTML",
  "Svelte",
  "Next.js",
];

const PRICE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("All");
  const [priceFilter, setPriceFilter] = useState("all");

  const components = useQuery(api.components.getPublicComponents, {
    framework: selectedFramework === "All" ? undefined : selectedFramework,
    isForSale: priceFilter === "paid" ? true : priceFilter === "free" ? false : undefined,
  });

  const filteredComponents = components?.filter((component) =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.tags.some((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Components
          </h1>
          <p className="text-gray-600">
            Discover amazing UI components created by the community.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Framework Filter */}
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                {FRAMEWORKS.map((framework) => (
                  <SelectItem key={framework} value={framework}>
                    {framework}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Filter */}
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedFramework !== "All" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedFramework("All")}>
                {selectedFramework} ×
              </Badge>
            )}
            {priceFilter !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setPriceFilter("all")}>
                {priceFilter === "free" ? "Free" : "Paid"} ×
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                Search: "{searchQuery}" ×
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredComponents && filteredComponents.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredComponents.length} component{filteredComponents.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredComponents.map((component, index) => (
                  <motion.div
                    key={component._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ComponentCard component={component} />
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              title="No components found"
              description="Try adjusting your search criteria or explore different categories."
              action={{
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery("");
                  setSelectedFramework("All");
                  setPriceFilter("all");
                },
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}