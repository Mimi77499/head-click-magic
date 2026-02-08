import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SayIt from "./pages/SayIt";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { CollaborativeMode } from "./components/CollaborativeMode";
import { TemplatesSelector } from "./components/TemplatesSelector";

const queryClient = new QueryClient();

const App = () => {
  const [currentMode, setCurrentMode] = useState<'home' | 'sayit' | 'collaborative' | 'templates' | 'landing'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleSelectMode = (mode: 'sayit' | 'collaborative' | 'templates' | 'landing') => {
    setCurrentMode(mode);
  };

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCurrentMode('collaborative');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                currentMode === 'home' ? (
                  <Home onSelectMode={handleSelectMode} />
                ) : currentMode === 'sayit' ? (
                  <SayIt />
                ) : currentMode === 'collaborative' ? (
                  <CollaborativeMode isHeadTrackingActive={false} />
                ) : currentMode === 'templates' ? (
                  <TemplatesSelector onSelectTemplate={handleSelectTemplate} />
                ) : currentMode === 'landing' ? (
                  <Landing />
                ) : (
                  <Home onSelectMode={handleSelectMode} />
                )
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
