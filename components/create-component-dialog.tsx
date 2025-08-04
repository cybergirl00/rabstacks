"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sandpack } from "@codesandbox/sandpack-react";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import DynamicPreview from "./DynamicPreview";

const FRAMEWORKS = [
  { value: "react", label: "React", template: "react" },
  { value: "vue", label: "Vue", template: "vue" },
  { value: "angular", label: "Angular", template: "angular" },
  { value: "svelte", label: "Svelte", template: "svelte" },
  { value: "html", label: "HTML", template: "vanilla" },
  { value: "nextjs", label: "Next.js", template: "nextjs" },
];

const DEFAULT_CODE = {
  react: `export default function Component() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        My Component
      </h2>
      <p className="text-gray-600">
        This is a sample component. Replace this with your own code.
      </p>
    </div>
  );
}`,
  vue: `<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-bold text-gray-800 mb-2">
      My Component
    </h2>
    <p class="text-gray-600">
      This is a sample component. Replace this with your own code.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Component'
}
</script>`,
  html: `<div class="p-4 bg-white rounded-lg shadow-md">
  <h2 class="text-xl font-bold text-gray-800 mb-2">
    My Component
  </h2>
  <p class="text-gray-600">
    This is a sample component. Replace this with your own code.
  </p>
</div>`,
};

interface CreateComponentDialogProps {
  projectId: Id<"projects">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateComponentDialog({
  projectId,
  open,
  onOpenChange,
}: CreateComponentDialogProps) {
  const { user } = useUser();
  const createComponent = useMutation(api.components.createComponent);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    framework: "react",
    code: DEFAULT_CODE.react,
    isPublic: true,
    isForSale: false,
    price: 0,
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFrameworkChange = (framework: string) => {
    setFormData({
      ...formData,
      framework,
      code: DEFAULT_CODE[framework as keyof typeof DEFAULT_CODE] || DEFAULT_CODE.react,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  setIsLoading(true);

  try {
    // 1. Call the AI fix code endpoint
    const res = await fetch("/api/ai/fixcode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: formData.code }),
    });

    if (!res.ok) {
      throw new Error("Failed to sanitize code");
    }

    const data = await res.json();
    const sanitizedCode = data.sanitizedCode;

    if (!sanitizedCode) {
      throw new Error("No sanitized code returned from API");
    }

    // 2. Create the component with the sanitized code
    await createComponent({
      projectId,
      userId: user.id,
      name: formData.name,
      description: formData.description || undefined,
      framework: formData.framework,
      code: formData.code,
      editedCode: sanitizedCode,
      isPublic: formData.isPublic,
      isForSale: formData.isForSale,
      price: formData.isForSale ? formData.price : undefined,
      tags: formData.tags,
    });

    toast.success("Component created successfully!");
    onOpenChange(false);

    // 3. Reset form
    setFormData({
      name: "",
      description: "",
      framework: "react",
      code: DEFAULT_CODE.react,
      isPublic: true,
      isForSale: false,
      price: 0,
      tags: [],
    });

  } catch (error: any) {
    console.error("Create component error:", error);
    toast.error(error.message || "Failed to create component");
  } finally {
    setIsLoading(false);
  }
};


  const selectedFramework = FRAMEWORKS.find(f => f.value === formData.framework);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Component</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Component Name *</Label>
                  <Input
                    id="name"
                    placeholder="Button Component"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="framework">Framework *</Label>
                  <Select
                    value={formData.framework}
                    onValueChange={handleFrameworkChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FRAMEWORKS.map((framework) => (
                        <SelectItem key={framework.value} value={framework.value}>
                          {framework.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your component..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X
                        className="h-3 w-3 ml-1"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className=" gap-4 h-96">
                <div className="space-y-2">
                  <Label>Code Editor</Label>
                  <Textarea
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="font-mono text-sm h-full resize-none"
                    placeholder="Paste your component code here..."
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label>Live Preview</Label>
                  <Card className="h-full">
                    <CardContent className="p-0 h-full">
                      {selectedFramework && (
                        <Sandpack
                          template={selectedFramework.template as any}
                          files={{
                            [`/App.${formData.framework === 'html' ? 'html' : 'js'}`]: formData.code,
                          }}
                          options={{
                            showNavigator: false,
                            showTabs: false,
                            showLineNumbers: true,
                            editorHeight: "100%",
                          }}
                          theme="light"
                        />
                      )}
                    </CardContent>
                  </Card>
                </div> */}

                {/* <DynamicPreview code={formData.code} /> */}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPublic: checked })
                    }
                  />
                  <Label htmlFor="public">Make this component public</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="forSale"
                    checked={formData.isForSale}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isForSale: checked })
                    }
                  />
                  <Label htmlFor="forSale">Sell this component</Label>
                </div>

                {formData.isForSale && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="100"
                      placeholder="1000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Component"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}