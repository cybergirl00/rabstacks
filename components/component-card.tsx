"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Copy, ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ComponentCardProps {
  component: {
    _id: string;
    name: string;
    description?: string;
    framework: string;
    code: string;
    screenshotUrl?: string;
    isForSale: boolean;
    price?: number;
    tags: string[];
    createdAt: number;
  };
  showActions?: boolean;
}

export function ComponentCard({ component, showActions = true }: ComponentCardProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(component.code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="relative aspect-video overflow-hidden bg-gray-50">
          {component.screenshotUrl ? (
            <Image
              src={component.screenshotUrl}
              alt={component.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-2xl font-mono text-gray-400">
                {"<" + component.framework + "/>"}
              </div>
            </div>
          )}
          
          {/* Quick actions overlay */}
          {showActions && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  handleCopyCode();
                }}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <Link href={`/component/${component._id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Link href={`/component/${component._id}`}>
              <h3 className="font-semibold hover:text-purple-600 transition-colors line-clamp-1">
                {component.name}
              </h3>
            </Link>
            
            {component.isForSale && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                ₦{component.price}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {component.framework}
            </Badge>
            {component.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {component.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {component.description}
            </p>
          )}
        </CardContent>

        {showActions && (
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="h-8 px-2">
                <Heart className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {new Date(component.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {component.isForSale && (
              <Button size="sm">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}