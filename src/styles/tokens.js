// Shhh.Space design tokens
// Blend of two reference directions:
//   "Clean Hush"   -> soft, light, floating cards with gentle shadows
//   "Night Signal" -> dusk backdrop, glassy borders, teal/lavender duotone

export const color = {
  duskInk: "#14151A",
  duskInkSoft: "#1B1C22",
  smokeGlassBorder: "rgba(255,255,255,0.08)",

  mist: "#F6F5F8",
  mistMuted: "#EBE9EF",

  fogWhite: "#EDEDF2",
  fogWhiteMuted: "rgba(237,237,242,0.6)",
  ink: "#1B1B1F",
  slate: "#6B6B75",

  signalTeal: "#4ABFAE",
  signalTealSoft: "rgba(74,191,174,0.15)",
  hushLavender: "#B6A6E0",
  hushLavenderSoft: "rgba(182,166,224,0.15)",
  quietMint: "#7FD9A6",
  quietMintSoft: "rgba(127,217,166,0.15)",

  duskDeep: "#0C0C10",
  mistGlass: "rgba(246, 245, 248, 0.82)",
};

export const font = {
  display: '"Sora", -apple-system, BlinkMacSystemFont, sans-serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", monospace',
};

export const radius = {
  card: "16px",
  pill: "999px",
  sm: "8px",
};

export const shadow = {
  card: "0 8px 24px rgba(0,0,0,0.35)",
  cardHover: "0 12px 32px rgba(0,0,0,0.45)",
};

export const statusBadge = {
  embed: { label: "Embed", bg: color.signalTealSoft, fg: color.signalTeal },
  launcher: { label: "Opens out", bg: color.mistMuted, fg: color.slate },
  native: { label: "Generate", bg: color.hushLavenderSoft, fg: "#6B5BA8" },
};

export const accessTag = {
  free: { label: "FREE", fg: color.signalTeal },
  adGated: { label: "AD-SUPPORTED", fg: color.hushLavender },
};
