"use client";

import React, { useEffect, useState } from "react";
import * as Babel from "@babel/standalone";

interface DynamicPreviewProps {
  code: string;
}

const DynamicPreview: React.FC<DynamicPreviewProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setError(null);
      setComponent(null);

      // Transform the code using Babel (ES6+ and JSX to ES5)
      const transformed = Babel.transform(code, {
        presets: ["react"],
        sourceType: "module",
      }).code;

      // Wrap the transformed code in a function to capture exports
      const wrappedCode = `
        const exports = {};
        ${transformed};
        return exports.default;
      `;

      const componentFactory = new Function("React", wrappedCode);
      const component = componentFactory(React);

      if (typeof component === "function") {
        setComponent(() => component);
      } else {
        setError("The exported component is not a valid React component.");
      }
    } catch (err: any) {
      console.error("Dynamic render error:", err);
      setError(err.message);
    }
  }, [code]);

  return (
    <div className="p-4 bg-white border rounded shadow w-full h-full overflow-auto">
      {error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : Component ? (
        <Component />
      ) : (
        <div className="text-gray-500">Rendering preview...</div>
      )}
    </div>
  );
};

export default DynamicPreview;
