// npm install react-live
import { LiveProvider, LivePreview } from 'react-live';
import React from "react";

// import tailwind from 'react-live-tailwind';

export function LiveCodePreview({ code }: { code: string }) {
  return (
    <LiveProvider
      code={code}
      scope={{ React }}
      transformCode={code => /* optionally wrap in a function component */ code}
    //   theme={tailwind}
    >
      <div className="border rounded-lg overflow-hidden">
        <LivePreview />
      </div>
    </LiveProvider>
  );
}
