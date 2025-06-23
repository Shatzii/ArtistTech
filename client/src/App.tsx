import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Landing from "./pages/landing";
import DJStudio from "./pages/dj-studio";
import SimpleVotingDemo from "./pages/simple-voting-demo";
import AdminDashboard from "./pages/admin-dashboard";
import AdminLogin from "./pages/admin-login";
import UserLogin from "./pages/user-login";

function AuthenticatedRouter() {
  return (
    <div className="min-h-screen">
      <main>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/login" component={UserLogin} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/dj" component={DJStudio} />
          <Route path="/voting" component={SimpleVotingDemo} />
          <Route component={Landing} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticatedRouter />
    </QueryClientProvider>
  );
}

export default App;
