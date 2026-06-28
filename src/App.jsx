import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ToolPanel from './pages/ToolPanel';
import Submit from './pages/Submit';
import PricingModal from './components/PricingModal';
import { color, font } from './styles/tokens';

// Global styles & font imports
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Sora:wght@200;400;700&family=JetBrains+Mono:wght@400;600&display=swap');
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 0.5; filter: blur(60px); }
    50% { transform: scale(1.2); opacity: 0.8; filter: blur(80px); }
  }
  
  @keyframes grainShift {
    0% { transform: translate(0, 0); }
    20% { transform: translate(-10%, 5%); }
    40% { transform: translate(5%, -10%); }
    60% { transform: translate(-5%, 10%); }
    80% { transform: translate(10%, -5%); }
    100% { transform: translate(0, 0); }
  }

  body {
    margin: 0;
    background-color: ${color.duskInk};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  *:focus-visible {
    outline: 2px solid ${color.signalTeal};
    outline-offset: 2px;
  }
`;

export default function App() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <Router>
      <style>{globalStyles}</style>
      
      {/* Static grain texture - 20s cycle for performance */}
      <div style={{
        position: 'fixed', top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
        width: '200%', height: '200%',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity: 0.03, 
        pointerEvents: 'none',
        zIndex: 9998,
        animation: 'grainShift 20s steps(10) infinite', 
      }} />

      <Routes>
        <Route path="/" element={<Home onOpenPricing={() => setIsPricingOpen(true)} />} />
        <Route path="/tool/:toolId" element={<ToolPanel />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>

      {isPricingOpen && <PricingModal onClose={() => setIsPricingOpen(false)} />}
    </Router>
  );
}
