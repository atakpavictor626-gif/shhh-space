// Shhh.Space curated tool directory data
// embedType controls how a card behaves when tapped:
//   "embed"    -> opens inside Shhh in an iframe panel
//   "launcher" -> opens in a new tab
//   "native"   -> Shhh's own UI calls the tool's API directly

export const categories = [
  {
    id: "image-gen",
    label: "Image Generation",
    tools: [
      { id: "pollinations", name: "Pollinations AI", tagline: "Free, no-signup image & text generation", url: "https://pollinations.ai", embedType: "native", adGated: true },
      { id: "ai-horde", name: "AI Horde", tagline: "Community-powered, donation-driven generation", url: "https://aihorde.net", embedType: "native", adGated: true },
      { id: "huggingface-spaces", name: "Hugging Face Spaces", tagline: "Thousands of open AI demos and tools", url: "https://huggingface.co/spaces", embedType: "embed", adGated: false },
    ],
  },
  { id: "video-gen", label: "Video Generation", tools: [] },
  {
    id: "coding",
    label: "Coding",
    tools: [
      { id: "codepen", name: "CodePen", tagline: "Live front-end playground", url: "https://codepen.io", embedType: "embed", adGated: false },
      { id: "stackblitz", name: "StackBlitz", tagline: "Full dev environment in the browser", url: "https://stackblitz.com", embedType: "embed", adGated: false },
    ],
  },
  { id: "lifestyle", label: "Lifestyle", tools: [] },
  {
    id: "socials",
    label: "Socials",
    tools: [
      { id: "youtube", name: "YouTube", tagline: "Video, embedded where allowed", url: "https://youtube.com", embedType: "embed", adGated: false },
      { id: "x", name: "X", tagline: "Opens in a new tab", url: "https://x.com", embedType: "launcher", adGated: false },
    ],
  },
];

export function findTool(toolId) {
  for (const category of categories) {
    const match = category.tools.find((tool) => tool.id === toolId);
    if (match) return match;
  }
  return null;
}
