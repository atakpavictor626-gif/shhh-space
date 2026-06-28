import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { color, font, radius, shadow, statusBadge, accessTag } from '../styles/tokens';
import { categories } from '../data/categories';

function BreathingHero() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '260px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        position: 'absolute', width: '180px', height: '180px', background: color.signalTeal, borderRadius: '50%',
        animation: 'breathe 8s ease-in-out infinite', zIndex: 1, left: '15%', top: '15%'
      }} />
      <div style={{
        position: 'absolute', width: '140px', height: '140px', background: color.hushLavender, borderRadius: '50%',
        animation: 'breathe 8s ease-in-out infinite 2s', zIndex: 1, right: '15%', bottom: '15%'
      }} />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px' }}>
        <h1 style={{
          fontFamily: font.display, fontWeight: 200, fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          color: color.fogWhite, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em'
        }}>
          Shhh<span style={{ color: color.signalTeal }}>.</span>Space
        </h1>
        <p style={{
          fontFamily: font.body, fontWeight: 300, fontSize: '1rem', color: color.fogWhiteMuted,
          marginTop: '12px', letterSpacing: '0.04em'
        }}>
          The directory of secret tools.
        </p>
      </div>
    </div>
  );
}

function ToolCard({ tool }) {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);
  
  const badge = statusBadge[tool.embedType] || statusBadge.launcher;
  const access = tool.adGated ? accessTag.adGated : accessTag.free;

  // Solid mist background for performance. No constant blur or float.
  const cardStyle = {
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    backgroundColor: color.mist, 
    border: `1px solid ${isPressed ? color.signalTeal : 'transparent'}`,
    borderRadius: radius.card, padding: '20px', cursor: 'pointer',
    minHeight: '140px', 
    boxShadow: isPressed ? shadow.cardHover : shadow.card,
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    outline: 'none',
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/tool/${tool.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/tool/${tool.id}`)}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      style={cardStyle}
      aria-label={`Open ${tool.name}`}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ fontFamily: font.display, color: color.ink, fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
            {tool.name}
          </h3>
          <span style={{
            display: 'inline-block', padding: '4px 10px', borderRadius: radius.pill,
            backgroundColor: badge.bg, color: badge.fg, fontSize: '0.7rem', fontWeight: 600,
            fontFamily: font.mono, letterSpacing: '0.04em', textTransform: 'uppercase',
            minWidth: '44px', textAlign: 'center'
          }}>
            {badge.label}
          </span>
        </div>
        <p style={{ fontFamily: font.body, color: color.slate, fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
          {tool.tagline}
        </p>
      </div>
      
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: font.mono, fontSize: '0.75rem', color: access.fg, letterSpacing: '0.05em', fontWeight: 600 }}>
          {access.label}
        </span>
        <div style={{
          width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke={color.slate} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Home({ onOpenPricing }) {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: color.duskInk, minHeight: '100vh', color: color.fogWhite, paddingBottom: '60px' }}>
      <BreathingHero />
      
      <div style={{ padding: '0 20px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: `1px solid ${color.smokeGlassBorder}`, paddingBottom: '16px' }}>
          <h2 style={{ fontFamily: font.display, fontSize: '1rem', fontWeight: 400, margin: 0, color: color.fogWhiteMuted }}>
            Curated Collection
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onOpenPricing} 
              style={headerBtnStyle}
              onMouseEnter={(e) => e.target.style.borderColor = color.hushLavender}
              onMouseLeave={(e) => e.target.style.borderColor = color.smokeGlassBorder}
            >
              Go Premium
            </button>
            <button 
              onClick={() => navigate('/submit')} 
              style={headerBtnStyle}
              onMouseEnter={(e) => e.target.style.borderColor = color.signalTeal}
              onMouseLeave={(e) => e.target.style.borderColor = color.smokeGlassBorder}
            >
              Submit Tool
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {categories.map((cat) => (
            <section key={cat.id}>
              <h3 style={{ fontFamily: font.mono, color: color.fogWhiteMuted, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                {cat.label}
              </h3>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {cat.tools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

const headerBtnStyle = {
  background: 'transparent', 
  border: `1px solid ${color.smokeGlassBorder}`, 
  color: color.fogWhiteMuted,
  padding: '10px 16px', 
  borderRadius: radius.pill, 
  cursor: 'pointer',
  fontFamily: font.mono, 
  fontSize: '0.75rem', 
  letterSpacing: '0.05em',
  transition: 'border-color 0.3s ease, color 0.3s ease', 
  minHeight: '44px', 
  display: 'flex', 
  alignItems: 'center'
};
