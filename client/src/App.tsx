import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import NewLanding from "./pages/new-landing";
import AuthenticationSuite from "./pages/authentication-suite";
import NotFound from "./pages/not-found";

// Core Studios
import UltimateMusicStudio from "./pages/ultimate-music-studio";
import VideoStudio from "./pages/video-studio";
import VisualStudio from "./pages/visual-studio";
import CollaborativeStudio from "./pages/collaborative-studio";
import DJStudio from "./pages/dj-studio";
import PodcastStudio from "./pages/podcast-studio";
import SocialMediaStudio from "./pages/social-media-studio";
import CryptoStudio from "./pages/crypto-studio";
import VRStudio from "./pages/vr-studio";
import NFTMarketplace from "./pages/nft-marketplace";

// Management Suites
import CareerManagement from "./pages/career-management";
import UltimateDJSuite from "./pages/ultimate-dj-suite";
import SocialMediaManagement from "./pages/social-media-management";
import EducationManagement from "./pages/education-management";
import AdminControlCenter from "./pages/admin-control-center";

// Additional Features
import AICareerManager from "./pages/ai-career-manager";
import AICareerDashboard from "./pages/ai-career-dashboard";
import GenreRemixer from "./pages/genre-remixer";
import ArtistCollaboration from "./pages/artist-collaboration";
import SocialMediaHub from "./pages/social-media-hub";
import CollaborativeDemo from "./pages/collaborative-demo";
import CreativeStudiosHub from "./pages/creative-studios-hub";
import MonetizationHub from "./pages/monetization-hub";
import ProfessionalToolsSuite from "./pages/professional-tools-suite";
import AnalyticsBusinessSuite from "./pages/analytics-business-suite";
import UltimateSocialSuite from "./pages/ultimate-social-suite";

function App() {
  return (
    <Switch>
      {/* Landing Page */}
      <Route path="/" component={() => (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">ARTIST TECH</h1>
            <p className="text-2xl mb-8">AI-Powered Music Production Platform</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <a href="/music-studio" className="bg-blue-600 p-4 rounded-lg hover:bg-blue-700">
                <h3 className="font-bold">Music Studio</h3>
                <p className="text-sm">19 AI Engines</p>
              </a>
              <a href="/dj-studio" className="bg-purple-600 p-4 rounded-lg hover:bg-purple-700">
                <h3 className="font-bold">DJ Studio</h3>
                <p className="text-sm">Professional Mixing</p>
              </a>
              <a href="/video-studio" className="bg-green-600 p-4 rounded-lg hover:bg-green-700">
                <h3 className="font-bold">Video Studio</h3>
                <p className="text-sm">AI Video Creation</p>
              </a>
              <a href="/social-media-hub" className="bg-orange-600 p-4 rounded-lg hover:bg-orange-700">
                <h3 className="font-bold">Social Media</h3>
                <p className="text-sm">Pay-to-View Platform</p>
              </a>
            </div>
          </div>
        </div>
      )} />
      
      {/* Authentication */}
      <Route path="/login" component={AuthenticationSuite} />
      <Route path="/admin-login" component={AuthenticationSuite} />
      <Route path="/user-login" component={AuthenticationSuite} />
      <Route path="/auth" component={AuthenticationSuite} />
      <Route path="/authentication-suite" component={AuthenticationSuite} />
      
      {/* Core Studios */}
      <Route path="/music-studio" component={UltimateMusicStudio} />
      <Route path="/ultimate-music-studio" component={UltimateMusicStudio} />
      <Route path="/video-studio" component={VideoStudio} />
      <Route path="/visual-studio" component={VisualStudio} />
      <Route path="/collaborative-studio" component={CollaborativeStudio} />
      <Route path="/dj-studio" component={DJStudio} />
      <Route path="/podcast-studio" component={PodcastStudio} />
      <Route path="/social-media-studio" component={SocialMediaStudio} />
      <Route path="/crypto-studio" component={CryptoStudio} />
      <Route path="/artistcoin" component={CryptoStudio} />
      <Route path="/vr-studio" component={VRStudio} />
      <Route path="/nft-marketplace" component={NFTMarketplace} />
      
      {/* Management Suites */}
      <Route path="/career-management" component={CareerManagement} />
      <Route path="/ultimate-dj-suite" component={UltimateDJSuite} />
      <Route path="/dj" component={UltimateDJSuite} />
      <Route path="/ultimate-dj-studio" component={UltimateDJSuite} />
      <Route path="/social-media-management" component={SocialMediaManagement} />
      <Route path="/education-management" component={EducationManagement} />
      <Route path="/admin-control-center" component={AdminControlCenter} />
      <Route path="/admin" component={AdminControlCenter} />
      
      {/* AI & Career Features */}
      <Route path="/ai-career-manager" component={AICareerManager} />
      <Route path="/ai-career-dashboard" component={AICareerDashboard} />
      <Route path="/genre-remixer" component={GenreRemixer} />
      <Route path="/artist-collaboration" component={ArtistCollaboration} />
      
      {/* Social & Hub Pages */}
      <Route path="/social-media-hub" component={SocialMediaHub} />
      <Route path="/social" component={SocialMediaHub} />
      <Route path="/collaborative-demo" component={CollaborativeDemo} />
      <Route path="/creative-studios-hub" component={CreativeStudiosHub} />
      <Route path="/monetization-hub" component={MonetizationHub} />
      <Route path="/professional-tools-suite" component={ProfessionalToolsSuite} />
      <Route path="/analytics-business-suite" component={AnalyticsBusinessSuite} />
      <Route path="/ultimate-social-suite" component={UltimateSocialSuite} />
      
      {/* 404 Page */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  );
}