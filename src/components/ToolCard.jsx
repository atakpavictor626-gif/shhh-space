import { useState } from "react";
import { Link } from "react-router-dom";
import { color, font, radius, shadow, statusBadge, accessTag } from "../styles/tokens";

function Badge({ embedType }) {
  const meta = statusBadge[embedType] ?? statusBadge.launcher;
  return (
    <span
      style={{
        fontFamily: font.mono,
        fontSize: "0.65rem",
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        padding: "0.2rem 0.5rem",
        borderRadius: radius.pill,
        background: meta.bg,
        color: meta.fg,
      }}
    >
      {meta.label}
    </span>
  );
}

function ArrowIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="none">
      <path
        d="M1 9L9 1M9 1H3M9 1V7"
        stroke={active ? color.signalTeal : color.slate}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ToolCard({ tool }) {
  const [hovered, setHovered] = useState(false);
  const access = tool.adGated ? accessTag.adGated : accessTag.free;

  const cardStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "0.75rem",
    padding: "1rem",
    minHeight: "128px",
    borderRadius: radius.card,
    textDecoration: "none",
    border: `1px solid ${hovered ? color.signalTeal : "rgba(0,0,0,0.04)"}`,
    background: hovered ? color.mistGlass : color.mist,
    backdropFilter: hovered ? "blur(12px)" : "none",
    boxShadow: hovered ? shadow.cardHover : shadow.card,
    transform: hovered ? "translateY(-3px)" : "translateY(0)",
    transition: "all 0.25s ease",
  };

  const content = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <strong style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1rem", color: color.ink }}>
          {tool.name}
        </strong>
        <Badge embedType={tool.embedType} />
      </div>

      <span style={{ fontFamily: font.body, fontSize: "0.82rem", color: color.slate, lineHeight: 1.4 }}>
        {tool.tagline}
      </span>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.04em", color: access.fg }}>
          {access.label}
        </span>
        <ArrowIcon active={hovered} />
      </div>
    </>
  );

  const sharedHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  if (tool.embedType === "launcher") {
    return (
      
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        style={cardStyle}
        aria-label={`Open ${tool.name} in a new tab`}
        {...sharedHandlers}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={`/tool/${tool.id}`}
      style={cardStyle}
      aria-label={`Open ${tool.name}`}
      {...sharedHandlers}
    >
      {content}
    </Link>
  );
}
