import { useState } from "react";
import { Link } from "react-router-dom";
import { color, font, radius } from "../styles/tokens";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const pageStyle = {
  minHeight: "100vh",
  background: color.duskInk,
  padding: "1.5rem 1rem 3rem",
  fontFamily: font.body,
};

const backLinkStyle = {
  color: color.fogWhiteMuted,
  textDecoration: "none",
  fontSize: "0.9rem",
  display: "inline-block",
  marginBottom: "1.5rem",
};

const headingStyle = {
  fontFamily: font.display,
  color: color.fogWhite,
  fontSize: "1.4rem",
  margin: 0,
};

const introStyle = {
  color: color.fogWhiteMuted,
  marginBottom: "1.5rem",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  marginBottom: "1rem",
};

const labelStyle = {
  fontSize: "0.85rem",
  color: color.fogWhiteMuted,
};

const inputStyle = {
  padding: "0.6rem 0.75rem",
  borderRadius: radius.sm,
  border: `1px solid ${color.smokeGlassBorder}`,
  background: color.duskInkSoft,
  color: color.fogWhite,
  fontFamily: font.body,
};

const buttonStyle = {
  padding: "0.7rem 1.2rem",
  borderRadius: radius.sm,
  border: "none",
  background: color.mist,
  color: color.ink,
  fontFamily: font.display,
  fontWeight: 600,
  cursor: "pointer",
};

const confirmStyle = {
  marginTop: "1rem",
  fontSize: "0.9rem",
  color: color.signalTeal,
};

const errorStyle = {
  color: "#f87171",
  fontSize: "0.9rem",
  marginTop: "0.5rem",
};

export default function Submit() {
  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "",
    note: "",
    embedType: "launcher",
    tagline: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!supabase) {
      setError(
        "Submissions aren't connected yet (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)."
      );
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      tool_name: form.name.trim(),
      url: form.url.trim(),
      category: form.category.trim() || null,
      note: form.note.trim() || null,
      embed_type: form.embedType,
      tagline: form.tagline.trim() || null,
      status: "pending",
    };

    try {
      const { error: insertError } = await supabase.from("submissions").insert([payload]);
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={pageStyle}>
      <Link to="/" style={backLinkStyle}>
        ← Back
      </Link>
      <h1 style={headingStyle}>Submit a tool</h1>
      <p style={introStyle}>
        Already live somewhere? Drop the link and we'll review it for a
        card.
      </p>

      {submitted ? (
        <p style={confirmStyle}>
          Got it — we'll review and follow up if it's a fit.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="name">
              Tool name *
            </label>
            <input
              style={inputStyle}
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="url">
              Live URL *
            </label>
            <input
              style={inputStyle}
              id="url"
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="tagline">
              Short tagline (one line)
            </label>
            <input
              style={inputStyle}
              id="tagline"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="category">
              Best-fit category
            </label>
            <input
              style={inputStyle}
              id="category"
              name="category"
              placeholder="e.g. Image Generation"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="note">
              Anything else worth knowing?
            </label>
            <input
              style={inputStyle}
              id="note"
              name="note"
              value={form.note}
              onChange={handleChange}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="embedType">
              How should it open?
            </label>
            <select
              style={inputStyle}
              id="embedType"
              name="embedType"
              value={form.embedType}
              onChange={handleChange}
            >
              <option value="launcher">Opens in a new tab (most tools)</option>
              <option value="embed">Embeds inside Shhh (if it allows it)</option>
              <option value="native">Has a public API we could call directly</option>
            </select>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button style={buttonStyle} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit for review"}
          </button>
        </form>
      )}
    </div>
  );
}
