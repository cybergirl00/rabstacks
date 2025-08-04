"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface EditProjectDialogProps {
  project: {
    _id: Id<"projects">;
    name: string;
    description?: string;
    bannerUrl?: string;
    isPublic: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onDelete,
}: EditProjectDialogProps) {
  const updateProject = useMutation(api.projects.updateProject);

  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || "",
    bannerUrl: project.bannerUrl || "",
    isPublic: project.isPublic,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProject({
        projectId: project._id,
        name: formData.name,
        description: formData.description || undefined,
        bannerUrl: formData.bannerUrl || undefined,
        isPublic: formData.isPublic,
      });

      toast.success("Project updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Banner Image URL</Label>
            <Input
              id="banner"
              value={formData.bannerUrl}
              onChange={(e) =>
                setFormData({ ...formData, bannerUrl: e.target.value })
              }
              placeholder="https://example.com/banner.jpg"
            />
            {formData.bannerUrl && (
              <div className="mt-2">
                <img
                  src={formData.bannerUrl}
                  alt="Banner preview"
                  className="w-full h-32 object-cover rounded-md"
                  onError={() => {
                    toast.error("Invalid image URL");
                    setFormData({ ...formData, bannerUrl: "" });
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isPublic: checked })
              }
            />
            <Label htmlFor="public">Make this project public</Label>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Project
            </Button>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Project"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}