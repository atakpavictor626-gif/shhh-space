import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { color, font, radius, shadow, statusBadge, accessTag } from '../styles/tokens';
import { categories } from '../data/categories';

export default function ToolPanel() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = categories.flatMap(c => c.tools).find(t => t.id === toolId);
  
  const [prompt, setPrompt] = useState('');
  const [genState, setGenState] = useState('idle'); // idle | ad_playing | generating | done
  const [countdown, setCountdown] = useState(5);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (genState === 'ad_playing' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (genState === 'ad_playing' && countdown === 0) {
      setGenState('idle');
      // Auto-trigger generation after ad
      handleGenerate(); 
    }
  }, [genState, countdown]);

  if (!tool) return <div style={{ backgroundColor: color.duskInk, height: '100vh', color: color.fogWhite, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Tool not found</div>;

  const badge = statusBadge[tool.embedType];

  const handleGenerateClick = () => {
    if (tool.adGated && genState === 'idle') {
      // Start DIY Ad Gate
      setGenState('ad_playing');
      setCountdown(5);
    } else if (!tool.adGated || genState === 'idle') {
      handleGenerate();
    }
  }

  const handleGenerate = () => {
    if (!prompt) return;
    setGenState('generating');
    // Mocking the DeepSeek R1 API call here using Pollinations direct URL
    // In production, this calls the actual native API
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;
    
    // Preload image to prevent UI flashing
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageUrl(url);
      setGenState('done');
    };
    img.onerror = () => setGenState('idle'); 
  };

  return (
    <div style={{ backgroundColor: color.duskInk, minHeight: '100vh', color: color.fogWhite, padding: '24px', display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => navigate('/')} style={backBtnStyle}>
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H1M1 5L5 9M1 5L5 1" stroke={color.signalTeal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Directory
      </button>
      
      <div style={{ backgroundColor: color.mist, borderRadius: radius.card, padding: '24px', color: color.ink, boxShadow: shadow.card, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontFamily: font.display, fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>{tool.name}</h1>
          <span style={{
            padding: '4px 10px', borderRadius: radius.pill,
            backgroundColor: badge.bg, color: badge.fg, fontSize: '0.7rem', fontWeight: 600,
            fontFamily: font.mono, letterSpacing: '0.04em', textTransform: 'uppercase'
          }}>
            {badge.label}
          </span>
        </div>

        {/* === BRANCH LOGIC === */}
        {tool.embedType === 'embed' && (
          <div style={{ flex: 1, border: `1px solid ${color.mistMuted}`, borderRadius: radius.sm, overflow: 'hidden', minHeight: '400px' }}>
            <iframe src={tool.url} title={tool.name} style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
        )}

        {tool.embedType === 'launcher' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontFamily: font.body, color: color.slate, marginBottom: '24px' }}>
              {tool.name} requires opening in a new tab to ensure full functionality and secure login.
            </p>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" style={primaryBtnStyle}>
              Launch {tool.name}
            </a>
          </div>
        )}

        {tool.embedType === 'native' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <div>
              <label style={{ fontFamily: font.mono, fontSize: '0.75rem', color: color.slate, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what to generate..."
                style={nativeInputStyle}
                rows={3}
              />
            </div>

            <button 
              onClick={handleGenerateClick}
              disabled={genState === 'generating' || genState === 'ad_playing'}
              style={{
                ...primaryBtnStyle,
                opacity: (genState === 'generating' || genState === 'ad_playing') ? 0.7 : 1,
                cursor: (genState === 'generating' || genState === 'ad_playing') ? 'not-allowed' : 'pointer'
              }}
            >
              {genState === 'ad_playing' ? `Ad playing: ${countdown}s` : 
               genState === 'generating' ? 'Generating...' : 
               tool.adGated ? 'Watch Ad to Generate' : 'Generate'}
            </button>

            {/* Native Generation Render Area */}
            <div style={{ 
              flex: 1, minHeight: '300px', backgroundColor: color.duskInkSoft, 
              borderRadius: radius.sm, display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative'
            }}>
              {genState === 'ad_playing' && (
                <div style={{ textAlign: 'center', color: color.fogWhiteMuted, fontFamily: font.mono, fontSize: '0.8rem' }}>
                  {/* Ad Placeholder */}
                  <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Sponsored Content</p>
                    <p style={{ fontSize: '2rem', color: color.signalTeal }}>{countdown}</p>
                    <p>Reward unlocks shortly</p>
                  </div>
                </div>
              )}
              
              {genState === 'generating' && (
                <div style={{ color: color.fogWhiteMuted, fontFamily: font.mono }}>Synthesizing signal...</div>
              )}
              
              {genState === 'done' && imageUrl && (
                <img src={imageUrl} alt="Generation result" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
              )}
              
              {genState === 'idle' && !imageUrl && (
                <div style={{ color: color.fogWhiteMuted, fontFamily: font.mono, fontSize: '0.8rem' }}>Awaiting input...</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const backBtnStyle = {
  background: 'none', border: 'none', color: color.signalTeal, cursor: 'pointer', 
  fontFamily: font.mono, fontSize: '0.9rem', padding: '12px 0', marginBottom: '24px', 
  minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start'
};

const primaryBtnStyle = {
  backgroundColor: color.signalTeal, color: color.duskInk, padding: '14px 24px', borderRadius: radius.pill,
  fontWeight: 700, textDecoration: 'none', fontFamily: font.body, fontSize: '0.9rem',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '44px',
  border: 'none', cursor: 'pointer', width: '100%'
};

const nativeInputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: radius.sm, border: `1px solid ${color.mistMuted}`,
  backgroundColor: '#FFFFFF', color: color.ink, fontFamily: font.body, fontSize: '0.95rem',
  marginTop: '8px', outline: 'none', boxSizing: 'border-box', resize: 'vertical'
};
