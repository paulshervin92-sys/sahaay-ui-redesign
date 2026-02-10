import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Analytics from "./pages/Analytics";
import CopingTools from "./pages/CopingTools";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Journal from "./pages/Journal";
import Settings from "./pages/Settings";
import SafetyPlan from "./pages/SafetyPlan";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: userLoading } = useUser();

  const onboardingCompleted = useMemo(() => {
    if (!user) return null;
    return Boolean(profile?.onboardingComplete);
  }, [user, profile]);

  if (authLoading || userLoading) {
    return <div className="min-h-screen" />;
  }

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
                !user ? (
                  <Auth />
                ) : onboardingCompleted ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/onboarding" replace />
                )
              }
            />
            <Route
              path="/onboarding"
              element={!user ? <Navigate to="/" replace /> : onboardingCompleted ? <Navigate to="/dashboard" replace /> : <Onboarding />}
            />
            <Route
              element={
                !user || !onboardingCompleted ? <Navigate to="/onboarding" replace /> : <AppLayout />
              }
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route path="/chat" element={<Chat />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/coping" element={<CopingTools />} />
              <Route path="/community" element={<Community />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/safety" element={<SafetyPlan />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
