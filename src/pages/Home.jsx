import { Link } from "react-router-dom";
import { categories } from "../data/categories";
import CategorySection from "../components/CategorySection";
import { color, font } from "../styles/tokens";

const pageStyle = {
  minHeight: "100vh",
  background: color.duskInk,
  paddingBottom: "3rem",
};

const grainStyle = {
  position: "fixed",
  top: "-50%",
  left: "-50%",
  width: "200%",
  height: "200%",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  opacity: 0.035,
  pointerEvents: "none",
  zIndex: 0,
  animation: "shhh-grain-drift 24s ease-in-out infinite",
};

const heroStyle = {
  position: "relative",
  padding: "3rem 1.5rem 2.5rem",
  textAlign: "center",
  overflow: "hidden",
};

const blobBase = {
  position: "absolute",
  width: "160px",
  height: "160px",
  borderRadius: "50%",
  filter: "blur(50px)",
  animation: "shhh-breathe 8s ease-in-out infinite",
  pointerEvents: "none",
};

const tealBlobStyle = { ...blobBase, background: color.signalTeal, top: "0", left: "15%" };
const lavenderBlobStyle = {
  ...blobBase,
  background: color.hushLavender,
  top: "20px",
  right: "15%",
  animationDelay: "2s",
};

const contentStyle = { position: "relative", zIndex: 1 };

const titleStyle = {
  fontFamily: font.display,
  fontWeight: 200,
  fontSize: "clamp(2.2rem, 9vw, 3.4rem)",
  color: color.fogWhite,
  margin: 0,
  letterSpacing: "-0.02em",
};

const subtitleStyle = {
  fontFamily: font.body,
  fontWeight: 300,
  fontSize: "0.95rem",
  color: color.fogWhiteMuted,
  marginTop: "0.6rem",
  letterSpacing: "0.03em",
  maxWidth: "30ch",
  marginLeft: "auto",
  marginRight: "auto",
};

const submitLinkStyle = {
  display: "inline-block",
  marginTop: "1.25rem",
  fontFamily: font.mono,
  fontSize: "0.8rem",
  color: color.signalTeal,
  textDecoration: "none",
  border: `1px solid ${color.signalTealSoft}`,
  borderRadius: "999px",
  padding: "0.4rem 0.9rem",
};

const sectionsWrapStyle = {
  position: "relative",
  zIndex: 1,
  padding: "0 1rem",
  maxWidth: "960px",
  margin: "0 auto",
};

export default function Home() {
  return (
    <div style={pageStyle}>
      <div style={grainStyle} />

      <div style={heroStyle}>
        <div style={tealBlobStyle} />
        <div style={lavenderBlobStyle} />
        <div style={contentStyle}>
          <h1 style={titleStyle}>
            Shhh<span style={{ color: color.signalTeal }}>.</span>Space
          </h1>
          <p style={subtitleStyle}>
            A quiet hub for the AI tools worth knowing about — sorted by
            what you're actually trying to do.
          </p>
          <Link to="/submit" style={submitLinkStyle}>
            + Submit a tool
          </Link>
        </div>
      </div>

      <div style={sectionsWrapStyle}>
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
