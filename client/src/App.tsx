import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { MobileOptimizedLayout } from "./components/MobileOptimizedLayout";
import { PerformanceIndicator } from "./components/AdaptiveComponents";
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
import MIDIController from "./pages/midi-controller";
import ProfessionalInstruments from "./pages/professional-instruments";
import GenreRemixer from "./pages/genre-remixer";
import ArtistCollaboration from "./pages/artist-collaboration";
import AdvancedVideoEditor from "./pages/advanced-video-editor";
import EnhancedLanding from "./pages/enhanced-landing";
import SocialMediaDashboard from "./pages/social-media-dashboard";
import SocialMediaStudio from "./pages/social-media-studio";
import SocialMediaHub from "./pages/social-media-hub";
import ArtistCoinViralDashboard from "./pages/artistcoin-viral-dashboard";

function AuthenticatedRouter() {
  return (
    <MobileOptimizedLayout>
      <main>
        <Switch>
          <Route path="/" component={SocialMediaHub} />
          <Route path="/landing" component={Landing} />
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
          <Route path="/social-media-deployment" component={SocialMediaDeployment} />
          <Route path="/midi-controller" component={MIDIController} />
          <Route path="/professional-instruments" component={ProfessionalInstruments} />
          <Route path="/genre-remixer" component={GenreRemixer} />
          <Route path="/artist-collaboration" component={ArtistCollaboration} />
          <Route path="/advanced-video-editor" component={AdvancedVideoEditor} />
          <Route path="/social-media-dashboard" component={SocialMediaDashboard} />
          <Route path="/social-media-studio" component={SocialMediaStudio} />
          <Route path="/social-media-hub" component={SocialMediaHub} />
          <Route path="/artistcoin-viral" component={ArtistCoinViralDashboard} />
          <Route path="/ultimate-music-studio" component={UltimateMusicStudio} />
          <Route path="/ultimate-dj-studio" component={UltimateDJStudio} />
          <Route path="/enterprise-management" component={EnterpriseManagement} />
          <Route path="/voting" component={SimpleVotingDemo} />
          <Route path="/enhanced" component={EnhancedLanding} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <PerformanceIndicator />
    </MobileOptimizedLayout>
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
