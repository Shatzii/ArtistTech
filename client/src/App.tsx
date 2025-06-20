import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Studio from "@/pages/studio";
import Lesson from "@/pages/lesson";
import Curriculum from "@/pages/curriculum";
import MPCStudio from "@/pages/mpc-studio";
import DJStudio from "@/pages/dj-studio";
import MIDIController from "@/pages/midi-controller";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";

import Login from "@/pages/login";
import TeacherPortal from "@/pages/teacher-portal";
import StudentDashboard from "@/pages/student-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/studio" component={Studio} />
      <Route path="/mpc" component={MPCStudio} />
      <Route path="/dj" component={DJStudio} />
      <Route path="/midi" component={MIDIController} />
      <Route path="/lesson" component={Lesson} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={Login} />
      <Route path="/teacher-portal" component={TeacherPortal} />
      <Route path="/student-dashboard" component={StudentDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
