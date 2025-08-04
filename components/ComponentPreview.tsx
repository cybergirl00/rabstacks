"use client";

import React from "react";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";

interface ComponentPreviewProps {
  code: string;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({ code }) => {
  return (
    <div className="rounded-xl overflow-hidden ring-1 ring-gray-200 shadow-sm">
      <SandpackProvider
        template="react"
        customSetup={{
          entry: "/App.js",
          dependencies: {
            tailwindcss: "^3.3.0",
          },
        }}
        files={{
          "/App.js": code,
          "/index.css": {
            code: `
@tailwind base;
@tailwind components;
@tailwind utilities;
            `,
            hidden: true,
          },
          "/tailwind.config.js": {
            code: `
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
            hidden: true,
          },
        }}
      >
        <SandpackPreview />
      </SandpackProvider>
    </div>
  );
};
