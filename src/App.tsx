import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import InvitationPage from "./pages/InvitationPage";
import MasterAdmin from "./pages/MasterAdmin";
import SecondaryAdmin from "./pages/SecondaryAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InvitationPage />} />
          <Route path="/invite/:id" element={<InvitationPage />} />
          <Route path="/admin/master" element={<div className="min-h-screen flex items-center justify-center text-display text-2xl text-foreground">Master Admin Panel — Coming Soon</div>} />
          <Route path="/admin/user/:id" element={<div className="min-h-screen flex items-center justify-center text-display text-2xl text-foreground">Secondary Admin Panel — Coming Soon</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
