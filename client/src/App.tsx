import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Landing from "./pages/landing";
import DJStudio from "./pages/dj-studio";
import SimpleVotingDemo from "./pages/simple-voting-demo";
import AdminDashboard from "./pages/admin-dashboard";
import AdminLogin from "./pages/admin-login";
import UserLogin from "./pages/user-login";
import VideoStudio from "./pages/video-studio";
import VisualStudio from "./pages/visual-studio";
import MusicStudio from "./pages/music-studio";
import CollaborativeStudio from "./pages/collaborative-studio";
import NFTMarketplace from "./pages/nft-marketplace";
import PodcastStudio from "./pages/podcast-studio";
import AICareerManager from "./pages/ai-career-manager";
import AICareerDashboard from "./pages/ai-career-dashboard";
import ProducerRevenueDashboard from "./pages/producer-revenue-dashboard";
import SocialMediaDeployment from "./pages/social-media-deployment";
import NotFound from "./pages/not-found";
import UltimateMusicStudio from "./pages/ultimate-music-studio";
import UltimateDJStudio from "./pages/ultimate-dj-studio";
import CMSAdmin from "./pages/cms-admin";
import EnterpriseManagement from "./pages/enterprise-management";

function AuthenticatedRouter() {
  return (
    <div className="min-h-screen">
      <main>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/login" component={UserLogin} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/cms-admin" component={CMSAdmin} />
          <Route path="/dj" component={UltimateDJStudio} />
          <Route path="/dj-studio" component={UltimateDJStudio} />
          <Route path="/music-studio" component={UltimateMusicStudio} />
          <Route path="/video-studio" component={VideoStudio} />
          <Route path="/visual-studio" component={VisualStudio} />
          <Route path="/collaborative-studio" component={CollaborativeStudio} />
          <Route path="/nft-marketplace" component={NFTMarketplace} />
          <Route path="/podcast-studio" component={PodcastStudio} />
          <Route path="/ai-career-manager" component={AICareerManager} />
          <Route path="/ai-career-dashboard" component={AICareerDashboard} />
          <Route path="/producer-revenue" component={ProducerRevenueDashboard} />
          <Route path="/ultimate-music-studio" component={UltimateMusicStudio} />
          <Route path="/ultimate-dj-studio" component={UltimateDJStudio} />
          <Route path="/enterprise-management" component={EnterpriseManagement} />
          <Route path="/voting" component={SimpleVotingDemo} />
          <Route component={NotFound} />
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
