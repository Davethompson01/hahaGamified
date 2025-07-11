
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Games from "./pages/Games";
import DinoGamePage from "./pages/DinoGamePage";
import DashboardPage from "./pages/DashboardPage";
import QuestsPage from "./pages/QuestsPage";
import DailyChallengesPage from "./pages/DailyChallengesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games/dino" element={<DinoGamePage />} />
          <Route path="/games/:gameId" element={<Games />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/daily-challenges" element={<DailyChallengesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
