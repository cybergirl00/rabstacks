"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const { isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.nav
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
          >
            <Code2 className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">UIMate</span>
          </motion.div>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <>
              <Button asChild className="hidden sm:flex">
                <Link href="/dashboard/new-project">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </Button>
              
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/explore">Explore</Link>
              </Button>
              
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
                userProfileMode="navigation"
                userProfileUrl="/profile"
              />
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}