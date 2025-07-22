import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import NewLanding from "./pages/new-landing";
import AuthenticationSuite from "./pages/authentication-suite";

function App() {
  return (
    <Switch>
      <Route path="/" component={NewLanding} />
      <Route path="/login" component={AuthenticationSuite} />
      <Route path="/admin-login" component={AuthenticationSuite} />
      <Route path="/user-login" component={AuthenticationSuite} />
      <Route>
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Artist Tech</h1>
            <p className="text-slate-400">Page not found</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}