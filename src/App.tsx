import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Preloader from "./components/Preloader";
import Index from "./pages/Index";
import About from "./pages/About";
import ServiceDetail from "./pages/ServiceDetail";
import PatientsVisitors from "./pages/PatientsVisitors";
import FindDoctor from "./pages/FindDoctor";
import PatientPortal from "./pages/PatientPortal";
import Location from "./pages/Location";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";

import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AnimatePresence mode="wait">
            {loading && <Preloader key="preloader" />}
          </AnimatePresence>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/patients-visitors" element={<PatientsVisitors />} />
              <Route path="/find-doctor" element={<FindDoctor />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              <Route path="/patient-portal" element={<PatientPortal />} />
              <Route path="/location" element={<Location />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
