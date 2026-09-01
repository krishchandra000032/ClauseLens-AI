import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Analysis from "./pages/Analysis";
import ClauseExplorer from "./pages/ClauseExplorer";
import AskContract from "./pages/AskContract";
import AskGeneral from "./pages/AskGeneral";
import DocumentViewer from "./pages/DocumentViewer";
import Processing from "./pages/Processing";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100%", background: "#F7F9FC", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/:id" element={<Navigate to="analysis" replace />} />
            <Route path="/documents/:id/analysis" element={<Analysis />} />
            <Route path="/documents/:id/clauses" element={<ClauseExplorer />} />
            <Route path="/documents/:id/ask" element={<AskContract />} />
            <Route path="/documents/:id/viewer" element={<DocumentViewer />} />
            <Route path="/processing/:id" element={<Processing />} />
            <Route path="/analysis" element={<Documents />} />
            <Route path="/ask" element={<AskGeneral />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
