import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
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
import ChatHistory from "./pages/ChatHistory";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import RewardsDashboard from "./pages/RewardsDashboard";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: userLoading } = useUser();

  const onboardingCompleted = useMemo(() => {
    if (!user) return null;
    return Boolean(profile?.onboardingComplete);
  }, [user, profile]);

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const postAuthPath = onboardingCompleted ? "/dashboard" : "/onboarding";

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={!user ? <Index /> : <Navigate to={postAuthPath} replace />}
            />
            <Route
              path="/auth"
              element={!user ? <Auth /> : <Navigate to={postAuthPath} replace />}
            />
            <Route
              path="/onboarding"
              element={!user ? <Navigate to="/" replace /> : onboardingCompleted ? <Navigate to="/dashboard" replace /> : <Onboarding />}
            />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route
              element={
                !user ? <Navigate to="/" replace /> : onboardingCompleted ? <AppLayout /> : <Navigate to="/onboarding" replace />
              }
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/history" element={<ChatHistory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/coping" element={<CopingTools />} />
              <Route path="/community" element={<Community />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/rewards" element={<RewardsDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/safety" element={<SafetyPlan />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
