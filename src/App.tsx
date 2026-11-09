import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import { MotionConfig } from "framer-motion";
import { LenisProvider } from "./lib/lenis";

// The unrouted coach portal (src/pages/app) needs a QueryClientProvider from @tanstack/react-query
// around these routes again before it is routed.
const App = () => (
  <MotionConfig reducedMotion="user">
    <LenisProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Coach portal + sign-in are disabled - send visitors back to marketing site */}
          <Route path="/app/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LenisProvider>
  </MotionConfig>
);

export default App;
