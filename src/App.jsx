import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import SubmitIdea from './pages/SubmitIdea.jsx';
import StatusPage from './pages/StatusPage.jsx';
import ReportPage from './pages/ReportPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/submit" element={<SubmitIdea />} />
        <Route path="/status/:id" element={<StatusPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
