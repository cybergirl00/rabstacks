"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/Navbar";
import { ComponentCard } from "@/components/component-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit, 
  Settings,
  Code2,
  Users,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreateComponentDialog } from "@/components/create-component-dialog";
import { EditProjectDialog } from "@/components/edit-project-dialog";
import { toast } from "sonner";

export default function ProjectPage() {
  const params = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [showCreateComponent, setShowCreateComponent] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);

  const projectId = params.projectId as Id<"projects">;
  
  const project = useQuery(api.projects.getProject, { projectId });
  const components = useQuery(api.components.getProjectComponents, { projectId });
  const currentUser = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );

  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);

  const isOwner = project && currentUser && project.userId === currentUser.clerkId;

  const handleDeleteProject = async () => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteProject({ projectId });
      toast.success("Project deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const toggleProjectVisibility = async () => {
    if (!project) return;
    
    try {
      await updateProject({
        projectId,
        isPublic: !project.isPublic,
      });
      toast.success(`Project is now ${!project.isPublic ? "public" : "private"}`);
    } catch (error) {
      toast.error("Failed to update project visibility");
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h1>
            <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or has been deleted.</p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-0">
              {/* Banner */}
              <div className="relative h-48 md:h-64 overflow-hidden rounded-t-lg">
                {project.bannerUrl ? (
                  <img
                    src={project.bannerUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <div className="text-6xl font-bold text-purple-300">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                
                {/* Project Actions */}
                {isOwner && (
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={toggleProjectVisibility}
                    >
                      {project.isPublic ? (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Private
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowEditProject(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {project.name}
                    </h1>
                    {project.description && (
                      <p className="text-gray-600 text-lg">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Code2 className="h-4 w-4 mr-1" />
                    {components?.length || 0} components
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <Badge variant={project.isPublic ? "default" : "secondary"}>
                    {project.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Components Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Components</h2>
            {isOwner && (
              <Button onClick={() => setShowCreateComponent(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Component
              </Button>
            )}
          </div>

          {components && components.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {components.map((component, index) => (
                <motion.div
                  key={component._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ComponentCard 
                    component={component} 
                    showActions={true}
                    isOwner={isOwner}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              title="No components yet"
              description={
                isOwner 
                  ? "Start building your UI library by creating your first component."
                  : "This project doesn't have any components yet."
              }
              action={
                isOwner 
                  ? {
                      label: "Create Component",
                      onClick: () => setShowCreateComponent(true),
                    }
                  : undefined
              }
            />
          )}
        </section>
      </div>

      {/* Dialogs */}
      {isOwner && (
        <>
          <CreateComponentDialog
            projectId={projectId}
            open={showCreateComponent}
            onOpenChange={setShowCreateComponent}
          />
          <EditProjectDialog
            project={project}
            open={showEditProject}
            onOpenChange={setShowEditProject}
            onDelete={handleDeleteProject}
          />
        </>
      )}
    </div>
  );
}