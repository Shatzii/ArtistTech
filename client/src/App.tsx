import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProStudioNavbar } from "@/components/navigation/ProStudioNavbar";
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
import PremiumStudio from "@/pages/premium-studio";

function AuthenticatedRouter() {
  // Direct access to all pages - no authentication required
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <ProStudioNavbar />
      <main className="pt-4">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route path="/admin" component={AdminLogin} />
          <Route path="/" component={Studio} />
          <Route path="/studio" component={Studio} />
          <Route path="/studio/dj" component={DJStudio} />
          <Route path="/mpc" component={MPCStudio} />
          <Route path="/dj" component={DJStudio} />
          <Route path="/video" component={VideoStudio} />
          <Route path="/visual" component={VisualStudio} />
          <Route path="/nft" component={NFTMarketplace} />
          <Route path="/collaborate" component={CollaborativeStudio} />
          <Route path="/business" component={BusinessDashboard} />
          <Route path="/premium" component={PremiumStudio} />
          <Route path="/midi" component={MIDIController} />
          <Route path="/lesson" component={Lesson} />
          <Route path="/curriculum" component={Curriculum} />
          <Route path="/teacher" component={TeacherPortal} />
          <Route path="/student" component={StudentDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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
