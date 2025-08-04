"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Mascot } from "@/components/mascot";
import { Code2, Palette, Share2, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <Mascot size="lg" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create & Share
            <span className="text-purple-600"> Beautiful</span>
            <br />
            UI Components
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rabstack is the ultimate playground for developers and designers to create, 
            showcase, and discover stunning UI components across multiple frameworks.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/sign-up">
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/explore">
                Explore Components
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to build amazing UIs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From creation to monetization, UIMate provides all the tools you need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Code2,
              title: "Multi-Framework Support",
              description: "Create components in React, Vue, HTML, and more with live previews.",
            },
            {
              icon: Palette,
              title: "Beautiful Gallery",
              description: "Showcase your work in a stunning, Dribbble-inspired layout.",
            },
            {
              icon: Share2,
              title: "Share & Collaborate",
              description: "Share your components with the community or keep them private.",
            },
            {
              icon: Zap,
              title: "Premium Features",
              description: "Unlock advanced features with our affordable premium subscription.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-purple-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start building?
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers and designers who are already creating 
            amazing UI components with UIMate.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/sign-up">
              Create Your First Project
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}