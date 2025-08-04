"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles } from "lucide-react";

interface CodeConverterProps {
  originalCode: string;
  originalFramework: string;
  targetFramework: string;
  isPremium: boolean;
}

// Mock code conversion - in a real app, this would use AI/ML services
const convertCode = (code: string, from: string, to: string): string => {
  const conversions: Record<string, Record<string, (code: string) => string>> = {
    react: {
      vue: (code) => code.replace(/export default function/g, '<template>\n  <div>').replace(/}/g, '</div>\n</template>\n\n<script>\nexport default {\n  name: "Component"\n}\n</script>'),
      html: (code) => code.replace(/className=/g, 'class=').replace(/export default function.*{/g, '').replace(/return \(/g, '').replace(/\);?\s*}$/g, ''),
      flutter: (code) => `import 'package:flutter/material.dart';\n\nclass MyComponent extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    return Container(\n      // Converted from React\n      child: Text('Component'),\n    );\n  }\n}`,
    },
    vue: {
      react: (code) => code.replace(/<template>/g, 'export default function Component() {\n  return (').replace(/<\/template>/g, '  );\n}'),
      html: (code) => code.replace(/<template>|<\/template>/g, '').replace(/<script>.*<\/script>/gs, ''),
    },
    html: {
      react: (code) => `export default function Component() {\n  return (\n    ${code.replace(/class=/g, 'className=')}\n  );\n}`,
      vue: (code) => `<template>\n  ${code}\n</template>\n\n<script>\nexport default {\n  name: 'Component'\n}\n</script>`,
    }
  };

  const converter = conversions[from]?.[to];
  return converter ? converter(code) : `// Code conversion from ${from} to ${to}\n// This is a premium feature\n\n${code}`;
};

export function CodeConverter({ originalCode, originalFramework, targetFramework, isPremium }: CodeConverterProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [convertedCode, setConvertedCode] = useState<string>("");

  const handleConvert = async () => {
    if (!isPremium) return;
    
    setIsConverting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const converted = convertCode(originalCode, originalFramework, targetFramework);
      setConvertedCode(converted);
      setIsConverting(false);
    }, 2000);
  };

  if (!isPremium) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-yellow-800">
              <Crown className="h-5 w-5 mr-2" />
              Premium Code Converter
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Premium Only
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 mb-4">
            Convert this {originalFramework} component to {targetFramework} and 50+ other frameworks with our AI-powered converter.
          </p>
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium - ₦1000/month
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          AI Code Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>From: <Badge variant="secondary">{originalFramework}</Badge></span>
            <span>To: <Badge variant="secondary">{targetFramework}</Badge></span>
          </div>
          
          <Button 
            onClick={handleConvert} 
            disabled={isConverting}
            className="w-full"
          >
            {isConverting ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Convert Code
              </>
            )}
          </Button>

          {convertedCode && (
            <div className="mt-4">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{convertedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}