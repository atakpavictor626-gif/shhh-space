import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { findTool } from "../data/categories";
import { color, font, radius, accessTag } from "../styles/tokens";

async function generatePollinations(prompt) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?width=1024&height=1024&model=flux&nologo=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations error: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

async function generateHorde(prompt) {
  const submitRes = await fetch("https://aihorde.net/api/v2/generate/async", {
    method: "POST",
    headers: { apikey: "0000000000", "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      models: ["AlbedoBase XL (SDXL)", "Deliberate", "Anything Diffusion"],
      params: { width: 512, height: 512, n: 1 },
    }),
  });
  if (!submitRes.ok) throw new Error(`Horde submit error: ${submitRes.status}`);
  const { id } = await submitRes.json();

  const statusUrl = `https://aihorde.net/api/v2/generate/status/${id}`;
  for (let attempts = 0; attempts < 60; attempts++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(statusUrl);
    if (!statusRes.ok) continue;
    const data = await statusRes.json();
    if (data.done && data.generations?.length > 0) {
      return data.generations[0].img;
    }
  }
  throw new Error("AI Horde generation timed out");
}

const wrapperStyle = { display: "flex", flexDirection: "column", height: "100vh", background: color.duskInk };
const barStyle = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "0.85rem 1rem", borderBottom: `1px solid ${color.smokeGlassBorder}`,
  color: color.fogWhite, fontFamily: font.body,
};
const backLinkStyle = {
  color: color.signalTeal, textDecoration: "none", fontSize: "0.85rem",
  fontFamily: font.mono, display: "flex", alignItems: "center", gap: "0.4rem",
};
const nameStyle = { fontFamily: font.display, fontWeight: 700 };
const centeredMsgStyle = {
  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
  color: color.fogWhiteMuted, fontFamily: font.body, fontSize: "0.9rem", textAlign: "center", padding: "2rem",
};
const nativeContentStyle = {
  flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem 1rem",
  overflowY: "auto", maxWidth: "720px", margin: "0 auto", width: "100%",
};
const taglineStyle = { color: color.fogWhiteMuted, fontFamily: font.body, fontSize: "0.95rem", marginBottom: "1.5rem" };
const inputStyle = {
  padding: "0.75rem 1rem", borderRadius: radius.sm, border: `1px solid ${color.smokeGlassBorder}`,
  background: color.duskInkSoft, color: color.fogWhite, fontFamily: font.body,
  fontSize: "1rem", width: "100%", boxSizing: "border-box", marginBottom: "1rem",
};
const buttonStyle = (disabled) => ({
  padding: "0.7rem 1.2rem", borderRadius: radius.sm, border: "none",
  background: disabled ? color.slate : color.signalTeal,
  color: disabled ? color.fogWhiteMuted : color.duskInk,
  fontFamily: font.display, fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer", transition: "background 0.2s",
});
const imageContainerStyle = {
  marginTop: "1.5rem", borderRadius: radius.card, overflow: "hidden",
  backgroundColor: color.duskInkSoft, display: "flex", justifyContent: "center",
  alignItems: "center", minHeight: "200px",
};
const imageStyle = { maxWidth: "100%", maxHeight: "60vh", objectFit: "contain" };
const errorStyle = { color: "#f87171", fontSize: "0.9rem", marginTop: "0.5rem" };
const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(20,21,26,0.92)", display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "2rem",
};
const overlayCardStyle = {
  background: color.duskInkSoft, borderRadius: radius.card, padding: "2rem",
  maxWidth: "400px", width: "100%", textAlign: "center", border: `1px solid ${color.smokeGlassBorder}`,
};
const timerStyle = { fontSize: "3rem", fontFamily: font.display, color: color.signalTeal, margin: "1rem 0" };

function BackArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
      <path d="M9 5H1M1 5L5 9M1 5L5 1" stroke={color.signalTeal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ToolPanel() {
  const { toolId } = useParams();
  const tool = findTool(toolId);

  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState("");
  const [adCompleted, setAdCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showAdGate, setShowAdGate] = useState(false);

  const timerRef = useRef(null);
  const lastImageUrlRef = useRef(null);

  useEffect(() => {
    setPrompt("");
    setGenerating(false);
    setGeneratedImage(null);
    setError("");
    setAdCompleted(false);
    setShowAdGate(Boolean(tool && tool.embedType === "native" && tool.adGated));
  }, [toolId]);

  useEffect(() => {
    if (!showAdGate) return;
    setCountdown(5);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setAdCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [showAdGate]);

  useEffect(() => {
    if (adCompleted && showAdGate) {
      const timeout = setTimeout(() => setShowAdGate(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [adCompleted, showAdGate]);

  useEffect(() => {
    return () => {
      if (lastImageUrlRef.current) URL.revokeObjectURL(lastImageUrlRef.current);
    };
  }, []);

  const handleGenerate = async () => {
    if (generating || !prompt.trim()) return;
    setGenerating(true);
    setError("");
    try {
      let imageUrl;
      if (tool.id === "pollinations") {
        imageUrl = await generatePollinations(prompt);
        if (lastImageUrlRef.current) URL.revokeObjectURL(lastImageUrlRef.current);
        lastImageUrlRef.current = imageUrl;
      } else if (tool.id === "ai-horde") {
        imageUrl = await generateHorde(prompt);
      } else {
        throw new Error("Unsupported native tool");
      }
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  if (!tool) {
    return (
      <div style={wrapperStyle}>
        <div style={barStyle}>
          <Link to="/" style={backLinkStyle}><BackArrow /> Back</Link>
        </div>
        <div style={centeredMsgStyle}>Tool not found.</div>
      </div>
    );
  }

  const access = tool.adGated ? accessTag.adGated : accessTag.free;

  if (tool.embedType !== "native") {
    return (
      <div style={wrapperStyle}>
        <div style={barStyle}>
          <Link to="/" style={backLinkStyle}><BackArrow /> Back</Link>
          <span style={nameStyle}>{tool.name}</span>
          <span style={{ fontFamily: font.mono, fontSize: "0.65rem", color: access.fg, letterSpacing: "0.04em" }}>
            {access.label}
          </span>
        </div>
        {tool.embedType === "embed" && (
          <iframe src={tool.url} title={tool.name} style={{ flex: 1, border: "none" }} allow="clipboard-write; fullscreen" />
        )}
        {tool.embedType === "launcher" && (
          <div style={centeredMsgStyle}>
            Opens in a new tab –{" "}
            <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ color: color.signalTeal }}>
              launch
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      {showAdGate && (
        <div style={overlayStyle}>
          <div style={overlayCardStyle}>
            <h2 style={{ fontFamily: font.display, color: color.fogWhite, marginTop: 0 }}>
              {adCompleted ? "Ready!" : "Watch a short ad"}
            </h2>
            {!adCompleted ? (
              <>
                <div style={timerStyle}>{countdown}</div>
                <p style={{ color: color.fogWhiteMuted, fontSize: "0.9rem" }}>
                  Please wait {countdown}s to unlock generation
                </p>
                <div style={{ background: color.duskInk, padding: "1rem", borderRadius: radius.sm, margin: "1rem 0", color: color.slate, fontSize: "0.8rem" }}>
                  [Ad placeholder]
                </div>
              </>
            ) : (
              <button style={buttonStyle(false)} onClick={() => setShowAdGate(false)}>
                Continue
              </button>
            )}
          </div>
        </div>
      )}

      <div style={barStyle}>
        <Link to="/" style={backLinkStyle}><BackArrow /> Back</Link>
        <span style={nameStyle}>{tool.name}</span>
        <span style={{ fontFamily: font.mono, fontSize: "0.65rem", color: access.fg, letterSpacing: "0.04em" }}>
          {access.label}
        </span>
      </div>

      <div style={nativeContentStyle}>
        <div style={taglineStyle}>{tool.tagline}</div>

        <label htmlFor="gen-prompt" style={{ position: "absolute", left: "-9999px" }}>
          Describe what you want to generate
        </label>
        <input
          id="gen-prompt"
          style={inputStyle}
          type="text"
          placeholder="Describe what you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          disabled={generating}
        />

        <button
          style={buttonStyle(!adCompleted || generating || !prompt.trim())}
          onClick={handleGenerate}
          disabled={!adCompleted || generating || !prompt.trim()}
        >
          {generating ? "Generating..." : "Generate"}
        </button>

        {error && <div style={errorStyle}>{error}</div>}

        {generatedImage && (
          <div style={imageContainerStyle}>
            <img src={generatedImage} alt={`AI-generated result for: ${prompt}`} style={imageStyle} />
          </div>
        )}
      </div>
    </div>
  );
}
