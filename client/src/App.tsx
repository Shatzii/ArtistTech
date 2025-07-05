import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import GlobalDashboard from "./pages/global-dashboard";
import ArtistFanEngagement from "./pages/artist-fan-engagement";

function AuthenticatedRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Artist Tech Platform...</div>
      </div>
    );
  }

  return (
    <div>
      <main>
        <Switch>
          {/* Public Routes */}
          <Route path="/landing" component={Landing} />
          <Route path="/login" component={UserLogin} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/enhanced" component={EnhancedLanding} />
          
          {/* Protected Routes - Main Hub */}
          <Route path="/" component={isAuthenticated ? SocialMediaHub : UserLogin} />
          <Route path="/social-media-hub" component={isAuthenticated ? SocialMediaHub : UserLogin} />
          
          {/* Studio Routes - All require authentication */}
          <Route path="/dj" component={isAuthenticated ? UltimateDJStudio : UserLogin} />
          <Route path="/dj-studio" component={isAuthenticated ? UltimateDJStudio : UserLogin} />
          <Route path="/music-studio" component={isAuthenticated ? UltimateMusicStudio : UserLogin} />
          <Route path="/ultimate-music-studio" component={isAuthenticated ? UltimateMusicStudio : UserLogin} />
          <Route path="/ultimate-dj-studio" component={isAuthenticated ? UltimateDJStudio : UserLogin} />
          <Route path="/video-studio" component={isAuthenticated ? VideoStudio : UserLogin} />
          <Route path="/visual-studio" component={isAuthenticated ? VisualStudio : UserLogin} />
          <Route path="/collaborative-studio" component={isAuthenticated ? CollaborativeStudio : UserLogin} />
          <Route path="/podcast-studio" component={isAuthenticated ? PodcastStudio : UserLogin} />
          <Route path="/advanced-video-editor" component={isAuthenticated ? AdvancedVideoEditor : UserLogin} />
          
          {/* AI & Professional Tools */}
          <Route path="/ai-career-manager" component={isAuthenticated ? AICareerManager : UserLogin} />
          <Route path="/ai-career-dashboard" component={isAuthenticated ? AICareerDashboard : UserLogin} />
          <Route path="/producer-revenue" component={isAuthenticated ? ProducerRevenueDashboard : UserLogin} />
          <Route path="/midi-controller" component={isAuthenticated ? MIDIController : UserLogin} />
          <Route path="/professional-instruments" component={isAuthenticated ? ProfessionalInstruments : UserLogin} />
          <Route path="/genre-remixer" component={isAuthenticated ? GenreRemixer : UserLogin} />
          <Route path="/artist-collaboration" component={isAuthenticated ? ArtistCollaboration : UserLogin} />
          
          {/* Social Media & Engagement */}
          <Route path="/social-media-deployment" component={isAuthenticated ? SocialMediaDeployment : UserLogin} />
          <Route path="/social-media-dashboard" component={isAuthenticated ? SocialMediaDashboard : UserLogin} />
          <Route path="/social-media-studio" component={isAuthenticated ? SocialMediaStudio : UserLogin} />
          <Route path="/artistcoin-viral" component={isAuthenticated ? ArtistCoinViralDashboard : UserLogin} />
          <Route path="/artist-fan-engagement" component={isAuthenticated ? ArtistFanEngagement : UserLogin} />
          
          {/* Marketplace & Business */}
          <Route path="/nft-marketplace" component={isAuthenticated ? NFTMarketplace : UserLogin} />
          <Route path="/global-dashboard" component={isAuthenticated ? GlobalDashboard : UserLogin} />
          <Route path="/voting" component={isAuthenticated ? SimpleVotingDemo : UserLogin} />
          
          {/* Admin Routes - Require admin role */}
          <Route path="/admin" component={isAuthenticated && user?.role === 'admin' ? AdminDashboard : UserLogin} />
          <Route path="/cms-admin" component={isAuthenticated && user?.role === 'admin' ? CMSAdmin : UserLogin} />
          <Route path="/enterprise-management" component={isAuthenticated && user?.role === 'admin' ? EnterpriseManagement : UserLogin} />
          
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthenticatedRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
