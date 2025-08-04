"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/project-card";
import { ComponentCard } from "@/components/component-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Plus, Folder, Compass } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useUser();
  const userProjects = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  
  const projects = useQuery(api.projects.getUserProjects,
    userProjects ? { userId: userProjects.clerkId } : "skip"
  );
  
  const publicComponents = useQuery(api.components.getPublicComponents, {
    limit: 12,
  });

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || "Creator"}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to create something amazing today?
          </p>
        </motion.div>

        {/* Your Projects Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Folder className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            </div>
            <Button asChild>
              <Link href="/dashboard/new-project">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>
          </div>

          {projects && projects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  showActions={true}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title="No projects yet"
              description="Create your first project to start building and organizing your UI components."
              action={{
                label: "Create Project",
                onClick: () => window.location.href = "/dashboard/new-project",
              }}
            />
          )}
        </section>

        {/* Explore Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Compass className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Explore Components</h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/explore">View All</Link>
            </Button>
          </div>

          {publicComponents && publicComponents.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {publicComponents.map((component) => (
                <ComponentCard
                  key={component._id}
                  component={component}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title="No public components yet"
              description="Be the first to share your components with the community!"
              action={{
                label: "Upload Component",
                onClick: () => window.location.href = "/dashboard/new-project",
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}