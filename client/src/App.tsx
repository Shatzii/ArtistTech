import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import SimpleVotingDemo from "./pages/simple-voting-demo";

function AuthenticatedRouter() {
  return (
    <div className="min-h-screen">
      <main>
        <Switch>
          <Route path="/" component={SimpleVotingDemo} />
          <Route path="/voting" component={SimpleVotingDemo} />
          <Route component={SimpleVotingDemo} />
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
