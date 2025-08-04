import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return new Response(JSON.stringify({ error: "Code is missing or invalid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

//     const prompt = `
// You're a code sanitizer for a component preview sandbox.
// Ensure the input code is a valid self-contained React component that:
// - Starts with necessary imports.
// - Has a default export.
// - Doesn't use undefined values.
// - Wraps returned JSX in a proper function.
// - Uses "tailwindcss" classes safely.
// Here’s the user's input:

// ${code}
//     `.trim();

// const prompt = `
// You are a React code sanitizer for a component preview system.

// Rewrite the user's code as valid JavaScript that:
// - Does not use import or export.
// - Uses \`exports.default = () => ( ...JSX... )\` to assign the component.
// - Assumes "React" is already in scope.
// - Uses tailwindcss classes properly.
// - Avoids undefined variables or props.
// - Does not include explanations — output code only.

// Here is the user's code:
// ${code}
// `.trim();

const langDetection = await openai.chat.completions.create({
  model: "openai/gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: `What language is this code written in? Reply with only the language name. No explanation.\n\n${code}`
    }
  ]
});
const language = langDetection.choices[0]?.message?.content?.trim();


// const prompt = `
// You're an expert developer assistant and a code santizer for a component preview system .

// A user has submitted some code. Your task:
// 1. Take this ${language} code and rewrite it as a valid \`exports.default = () => ( ...JSX... )\` component
// 2. Assumes "React" is already in scope.
// 4. Ensure the component is safe to use in a production environment.
// 5. Uses tailwindcss classes properly.
// 6. Avoids undefined variables or props.
// 7. Does not include any unnecessary code or comments.
// 8. The component must be purely visual (if possible) and styled using Tailwind CSS.
// 9. Convert any form of styling in another language to tilwind Css and it should match the original design 


// Show nothing except the converted React component code. Don't explain anything.

// User's input:

// ${code}
// `.trim();


const prompt = `
You're an expert developer assistant and a code sanitizer for a component preview system.

A user has submitted some code. Your task:

1. Take this ${language} code and rewrite it as a valid \`exports.default = () => ( ...JSX... )\` component.
2. Rewrite it as a valid React functional component using:
   \`exports.default = () => { ... }\`
3. Assume "React" is already in scope.
4. Place **all React hooks (e.g., useState, useEffect)** inside the function body — never outside.
5. Event handlers (e.g., onClick handlers) must also be defined **inside** the component function.
6. The component must be safe for production and self-contained.
7. Style the component using Tailwind CSS, matching the original design as closely as possible.
8. Do not include explanations, comments, or unnecessary code.
9. Output **only** the React code.
10. **Do not** wrap the output in \`\`\` or any Markdown formatting. Just return the raw code string.

User's input:

${code}
`.trim();



    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const output = completion.choices[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ sanitizedCode: output }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Code sanitizer error:", error);
    return new Response(JSON.stringify({ error: "Failed to sanitize code" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
