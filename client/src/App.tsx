import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Studio from "@/pages/studio";
import Lesson from "@/pages/lesson";
import Curriculum from "@/pages/curriculum";
import MPCStudio from "@/pages/mpc-studio";
import DJStudio from "@/pages/dj-studio";
import MIDIController from "@/pages/midi-controller";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";
import TeacherPortal from "@/pages/teacher-portal";
import StudentDashboard from "@/pages/student-dashboard";
import VideoStudio from "@/pages/video-studio";
import VisualStudio from "@/pages/visual-studio";
import NFTMarketplace from "@/pages/nft-marketplace";
import CollaborativeStudio from "@/pages/collaborative-studio";
import BusinessDashboard from "@/pages/business-dashboard";
import AdminLogin from "@/pages/admin-login";

function AuthenticatedRouter() {
  // Direct access bypass for development/demo mode
  const isDemoMode = true; // Set to false to enable full auth

  if (isDemoMode) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/admin" component={AdminLogin} />
        <Route path="/" component={Studio} />
        <Route path="/studio" component={Studio} />
        <Route path="/mpc" component={MPCStudio} />
        <Route path="/dj" component={DJStudio} />
        <Route path="/video" component={VideoStudio} />
        <Route path="/visual" component={VisualStudio} />
        <Route path="/nft" component={NFTMarketplace} />
        <Route path="/collaborate" component={CollaborativeStudio} />
        <Route path="/business" component={BusinessDashboard} />
        <Route path="/midi" component={MIDIController} />
        <Route path="/lesson" component={Lesson} />
        <Route path="/curriculum" component={Curriculum} />
        <Route path="/teacher" component={TeacherPortal} />
        <Route path="/student" component={StudentDashboard} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading ProStudio...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin" component={AdminLogin} />
      {!isAuthenticated ? (
        <Route component={AuthPage} />
      ) : (
        <>
          <Route path="/" component={Studio} />
          <Route path="/studio" component={Studio} />
          <Route path="/mpc" component={MPCStudio} />
          <Route path="/dj" component={DJStudio} />
          <Route path="/video" component={VideoStudio} />
          <Route path="/visual" component={VisualStudio} />
          <Route path="/nft" component={NFTMarketplace} />
          <Route path="/collaborate" component={CollaborativeStudio} />
          <Route path="/business" component={BusinessDashboard} />
          <Route path="/midi" component={MIDIController} />
          <Route path="/lesson" component={Lesson} />
          <Route path="/curriculum" component={Curriculum} />
          <Route path="/teacher" component={TeacherPortal} />
          <Route path="/student" component={StudentDashboard} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthenticatedRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
