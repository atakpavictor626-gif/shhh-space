import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ToolPanel from "./pages/ToolPanel";
import Submit from "./pages/Submit";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tool/:toolId" element={<ToolPanel />} />
      <Route path="/submit" element={<Submit />} />
    </Routes>
  );
}
