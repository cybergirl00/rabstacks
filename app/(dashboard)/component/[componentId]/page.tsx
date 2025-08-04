"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Copy, 
  Heart, 
  ShoppingCart, 
  Crown,
  Code2,
  Eye,
  Download
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sandpack } from "@codesandbox/sandpack-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { ComponentPreview } from "@/components/ComponentPreview";
import { LiveCodePreview } from "@/components/LiveCodePreview";
import DynamicPreview from "@/components/DynamicPreview";
// import { CodeConverter } from "@/components/code-converter";

const FRAMEWORKS = [
  { value: "react", label: "React", template: "react" },
  { value: "vue", label: "Vue", template: "vue" },
  { value: "angular", label: "Angular", template: "angular" },
  { value: "svelte", label: "Svelte", template: "svelte" },
  { value: "html", label: "HTML", template: "vanilla" },
  { value: "nextjs", label: "Next.js", template: "nextjs" },
  { value: "flutter", label: "Flutter", template: "vanilla" },
  { value: "react-native", label: "React Native", template: "react" },
];


const code = `
  const Component = () => (
    <button className="bg-blue-600 text-white px-4 py-2 rounded">
      I am dynamic
    </button>
  );

  render(Component);
`;

export default function ComponentPage() {
  const params = useParams();
  const { user } = useUser();
  const [selectedFramework, setSelectedFramework] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const componentId = params.componentId as Id<"components">;
  
  const component = useQuery(api.components.getComponent, { componentId });
  const currentUser = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleFrameworkChange = (framework: string) => {
    if (!currentUser?.isPremium && framework !== component?.framework) {
      setShowPremiumModal(true);
      return;
    }
    setSelectedFramework(framework);
  };

  const displayFramework = selectedFramework || component?.framework || "react";
  const displayCode = selectedFramework && selectedFramework !== component?.framework 
    ? "// Premium feature: Code conversion available with subscription" 
    : component?.code || "";

  if (!component) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Component not found</h1>
            <p className="text-gray-600 mb-4">The component you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/explore">Explore Components</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedFrameworkData = FRAMEWORKS.find(f => f.value === displayFramework);

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
            <Link href="/explore">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explore
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Component Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{component.name}</CardTitle>
                      {component.description && (
                        <p className="text-gray-600">{component.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{component.framework}</Badge>
                      {component.isForSale && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          ₦{component.price}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {component.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Framework Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Framework Converter</CardTitle>
                    {!currentUser?.isPremium && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Select value={displayFramework} onValueChange={handleFrameworkChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FRAMEWORKS.map((framework) => (
                        <SelectItem key={framework.value} value={framework.value}>
                          <div className="flex items-center">
                            {framework.label}
                            {!currentUser?.isPremium && framework.value !== component.framework && (
                              <Crown className="h-3 w-3 ml-2 text-yellow-600" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>

            {/* Code and Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Live Preview</TabsTrigger>
                  <TabsTrigger value="code">Source Code</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-4">
                  <Card>
                    <CardContent className="p-0">
                      <div className="h-96">
                        {selectedFrameworkData && (
                        //   <Sandpack
                        //     template={selectedFrameworkData.template as any}
                        //     files={{
                        //       [`/App.${displayFramework === 'html' ? 'html' : 'js'}`]: displayCode,
                        //     }}
                        //     options={{
                        //       showNavigator: false,
                        //       showTabs: false,
                        //       showLineNumbers: false,
                        //       editorHeight: "100%",
                        //     }}
                        //     theme="dark"
                        //   />

                        <DynamicPreview
  code={component.editedCode}
/>

                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="code" className="mt-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {selectedFrameworkData?.label} Code
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyCode(displayCode)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Code
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="relative">
                        {!currentUser?.isPremium && selectedFramework && selectedFramework !== component.framework ? (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <div className="text-center text-white">
                              <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                              <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
                              <p className="mb-4">Upgrade to convert code between frameworks</p>
                              <Button variant="secondary">
                                Upgrade to Premium
                              </Button>
                            </div>
                          </div>
                        ) : null}
                        
                        <SyntaxHighlighter
                          language={displayFramework === 'html' ? 'html' : 'javascript'}
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            maxHeight: '400px',
                          }}
                        >
                          {displayCode}
                        </SyntaxHighlighter>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={() => handleCopyCode(component.code)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Save to Favorites
                  </Button>

                  {component.isForSale && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy for ₦{component.price}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Component Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Component Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Framework:</span>
                    <Badge variant="secondary">{component.framework}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span>{new Date(component.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Updated:</span>
                    <span>{new Date(component.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Visibility:</span>
                    <Badge variant={component.isPublic ? "default" : "secondary"}>
                      {component.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}