"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, EyeOff, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    description?: string;
    bannerUrl?: string;
    isPublic: boolean;
    componentCount: number;
    createdAt: number;
  };
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({
  project,
  showActions = false,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="relative aspect-video overflow-hidden">
          {project.bannerUrl ? (
            <Image
              src={project.bannerUrl}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <div className="text-4xl font-bold text-purple-300">
                {project.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          {/* Project visibility badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={project.isPublic ? "default" : "secondary"}>
              {project.isPublic ? (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
          </div>

          {/* Actions dropdown */}
          {showActions && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="text-destructive"
                  >
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <Link href={`/project/${project._id}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-purple-600 transition-colors line-clamp-1">
              {project.name}
            </h3>
          </Link>
          
          {project.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {project.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{project.componentCount} components</span>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}