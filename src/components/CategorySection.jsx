import ToolCard from "./ToolCard";
import { color, font } from "../styles/tokens";

const sectionStyle = {
  marginBottom: "2.5rem",
};

const headingStyle = {
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: "1.05rem",
  marginBottom: "0.9rem",
  color: color.fogWhite,
  borderBottom: `1px solid ${color.smokeGlassBorder}`,
  paddingBottom: "0.6rem",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "0.85rem",
};

const emptyStyle = {
  fontFamily: font.body,
  fontSize: "0.85rem",
  color: color.fogWhiteMuted,
};

export default function CategorySection({ category }) {
  return (
    <section style={sectionStyle}>
      <h2 style={headingStyle}>{category.label}</h2>
      {category.tools.length === 0 ? (
        <p style={emptyStyle}>Tools coming soon.</p>
      ) : (
        <div style={gridStyle}>
          {category.tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </section>
  );
}
