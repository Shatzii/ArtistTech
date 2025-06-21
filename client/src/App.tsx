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

function AuthenticatedRouter() {
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

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Switch>
      <Route path="/" component={Studio} />
      <Route path="/studio" component={Studio} />
      <Route path="/mpc" component={MPCStudio} />
      <Route path="/dj" component={DJStudio} />
      <Route path="/video" component={VideoStudio} />
      <Route path="/midi" component={MIDIController} />
      <Route path="/lesson" component={Lesson} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/teacher" component={TeacherPortal} />
      <Route path="/student" component={StudentDashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
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
