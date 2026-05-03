import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import Browse from "./pages/Browse";
import MyLearning from "./pages/MyLearning";
import Watch from "./pages/Watch";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

export default function App() {
  const initAuth = useAuthStore((state) => state.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<Browse />} />

            {/* User Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-learning" 
              element={
                <ProtectedRoute>
                  <MyLearning />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/watch/:id" 
              element={
                <ProtectedRoute>
                  <Watch />
                </ProtectedRoute>
              } 
            />

            {/* Admin Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <Admin />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
}
