import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Welcome from "./pages/Welcome";
import InitialDashboard from "./pages/InitialDashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MainDashboard from "./pages/MainDashboard";
import Analysis from "./pages/Analysis";
import Results from "./pages/Results";
import PostAnalysis from "./pages/PostAnalysis";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Inspiration from "./pages/Inspiration";
import Generator from "./pages/Generator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<InitialDashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/app" element={<MainDashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/results" element={<Results />} />
        <Route path="/post-analysis" element={<PostAnalysis />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
