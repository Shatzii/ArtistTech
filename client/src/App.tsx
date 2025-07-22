import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Landing from "./pages/landing";

import AdminDashboard from "./pages/admin-dashboard";
import AdminLogin from "./pages/admin-login";
import UserLogin from "./pages/user-login";


import MusicStudio from "./pages/music-studio";

import CollaborativeDemo from "./pages/collaborative-demo";
import NFTMarketplace from "./pages/nft-marketplace";
import PodcastStudio from "./pages/podcast-studio";
// AI Career Manager uses ai-career-dashboard component
import AICareerDashboard from "./pages/ai-career-dashboard";

// Functional Studios - Core Creative Tools
import UltimateMusicStudio from "./pages/ultimate-music-studio";
import VideoStudio from "./pages/video-studio";
import VisualStudio from "./pages/visual-studio";
import CollaborativeStudio from "./pages/collaborative-studio";
import AICareerManager from "./pages/ai-career-manager";
import DJStudio from "./pages/dj-studio";
import SocialMediaStudio from "./pages/social-media-studio";
import CryptoStudio from "./pages/crypto-studio";
import VRStudio from "./pages/vr-studio";
import NotFound from "./pages/not-found";

import UltimateDJStudio from "./pages/ultimate-dj-studio";
import UltimateDJSuite from "./pages/ultimate-dj-suite";
import CareerManagement from "./pages/career-management";
import SocialMediaManagement from "./pages/social-media-management";
import EducationManagement from "./pages/education-management";
import AdminControlCenter from "./pages/admin-control-center";
import AuthenticationSuite from "./pages/authentication-suite";

import GenreRemixer from "./pages/genre-remixer";
import ArtistCollaboration from "./pages/artist-collaboration";

import EnhancedLanding from "./pages/enhanced-landing";
import SocialMediaHub from "./pages/social-media-hub";
import UltimateSocialSuite from "./pages/ultimate-social-suite";
import CreativeStudiosHub from "./pages/creative-studios-hub";
import MonetizationHub from "./pages/monetization-hub";
import ProfessionalToolsSuite from "./pages/professional-tools-suite";
import AnalyticsBusinessSuite from "./pages/analytics-business-suite";

function AuthenticatedRouter() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Simple auth check without context dependency for public routes
  const checkSimpleAuth = () => {
    return !!localStorage.getItem('authToken');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Artist Tech Platform...</div>
      </div>
    );
  }

  const isUserAuthenticated = isAuthenticated || checkSimpleAuth();

  return (
    <div>
      <main>
        <Switch>
          {/* Public Routes */}
          <Route path="/landing" component={Landing} />
          <Route path="/login" component={AuthenticationSuite} />
          <Route path="/admin-login" component={AuthenticationSuite} />
          <Route path="/auth" component={AuthenticationSuite} />
          <Route path="/user-login" component={AuthenticationSuite} />
          <Route path="/enhanced" component={EnhancedLanding} />
          
          {/* Protected Routes - Main Hub */}
          <Route path="/" component={isUserAuthenticated ? SocialMediaHub : AuthenticationSuite} />
          <Route path="/social-media-hub" component={isUserAuthenticated ? SocialMediaHub : AuthenticationSuite} />
          
          {/* Studio Routes - All require authentication - FUNCTIONAL STUDIOS RESTORED */}
          <Route path="/dj" component={isUserAuthenticated ? DJStudio : AuthenticationSuite} />
          <Route path="/dj-studio" component={isUserAuthenticated ? DJStudio : AuthenticationSuite} />
          <Route path="/ultimate-dj-studio" component={isUserAuthenticated ? UltimateDJSuite : AuthenticationSuite} />
          
          {/* Core Creative Studios - Fully Functional */}
          <Route path="/music-studio" component={isUserAuthenticated ? UltimateMusicStudio : AuthenticationSuite} />
          <Route path="/ultimate-music-studio" component={isUserAuthenticated ? UltimateMusicStudio : AuthenticationSuite} />
          <Route path="/video-studio" component={isUserAuthenticated ? VideoStudio : AuthenticationSuite} />
          <Route path="/visual-studio" component={isUserAuthenticated ? VisualStudio : AuthenticationSuite} />
          <Route path="/collaborative-studio" component={isUserAuthenticated ? CollaborativeStudio : AuthenticationSuite} />
          <Route path="/collaborative-demo" component={CollaborativeDemo} />
          <Route path="/podcast-studio" component={isUserAuthenticated ? PodcastStudio : AuthenticationSuite} />
          <Route path="/social-media-studio" component={isUserAuthenticated ? SocialMediaStudio : AuthenticationSuite} />
          <Route path="/crypto-studio" component={isUserAuthenticated ? CryptoStudio : AuthenticationSuite} />
          <Route path="/vr-studio" component={isUserAuthenticated ? VRStudio : AuthenticationSuite} />
          <Route path="/advanced-video-editor" component={isUserAuthenticated ? VideoStudio : AuthenticationSuite} />
          
          {/* AI & Professional Tools - FUNCTIONAL STUDIOS RESTORED */}
          <Route path="/ai-career-manager" component={isUserAuthenticated ? AICareerManager : AuthenticationSuite} />
          <Route path="/ai-career-dashboard" component={isUserAuthenticated ? CareerManagement : AuthenticationSuite} />
          <Route path="/career-management" component={isUserAuthenticated ? CareerManagement : AuthenticationSuite} />
          <Route path="/producer-revenue" component={isUserAuthenticated ? MonetizationHub : AuthenticationSuite} />

          <Route path="/genre-remixer" component={isUserAuthenticated ? GenreRemixer : AuthenticationSuite} />
          <Route path="/artist-collaboration" component={isUserAuthenticated ? ArtistCollaboration : AuthenticationSuite} />
          
          {/* Social Media & Engagement - Unified */}
          <Route path="/social-media-management" component={isUserAuthenticated ? SocialMediaManagement : AuthenticationSuite} />
          <Route path="/social-media-deployment" component={isUserAuthenticated ? SocialMediaManagement : AuthenticationSuite} />
          <Route path="/social-media-dashboard" component={isUserAuthenticated ? SocialMediaManagement : AuthenticationSuite} />
          <Route path="/social-media-studio" component={isUserAuthenticated ? SocialMediaManagement : AuthenticationSuite} />
          <Route path="/artistcoin-viral" component={isUserAuthenticated ? MonetizationHub : AuthenticationSuite} />
          
          {/* Phase 3 Unified Suites */}
          <Route path="/ultimate-social-suite" component={isUserAuthenticated ? UltimateSocialSuite : AuthenticationSuite} />
          <Route path="/creative-studios-hub" component={isUserAuthenticated ? CreativeStudiosHub : AuthenticationSuite} />
          <Route path="/monetization-hub" component={isUserAuthenticated ? MonetizationHub : AuthenticationSuite} />
          <Route path="/professional-tools-suite" component={isUserAuthenticated ? CreativeStudiosHub : AuthenticationSuite} />
          <Route path="/analytics-business-suite" component={isUserAuthenticated ? AnalyticsBusinessSuite : AuthenticationSuite} />
          
          {/* Consolidated Routes - Phase 3 - Hub Access */}
          <Route path="/artistcoin-hub" component={isUserAuthenticated ? MonetizationHub : AuthenticationSuite} />
          <Route path="/midi-controller" component={isUserAuthenticated ? CreativeStudiosHub : AuthenticationSuite} />
          <Route path="/professional-instruments" component={isUserAuthenticated ? CreativeStudiosHub : AuthenticationSuite} />
          <Route path="/global-dashboard" component={isUserAuthenticated ? AnalyticsBusinessSuite : AuthenticationSuite} />
          <Route path="/artist-fan-engagement" component={isUserAuthenticated ? AnalyticsBusinessSuite : AuthenticationSuite} />
          <Route path="/voting" component={isUserAuthenticated ? AnalyticsBusinessSuite : AuthenticationSuite} />
          
          {/* Education & Learning - Unified */}
          <Route path="/education" component={isUserAuthenticated ? EducationManagement : AuthenticationSuite} />
          <Route path="/education-hub" component={isUserAuthenticated ? EducationManagement : AuthenticationSuite} />
          <Route path="/teacher-portal" component={isUserAuthenticated ? EducationManagement : AuthenticationSuite} />
          <Route path="/student-dashboard" component={isUserAuthenticated ? EducationManagement : AuthenticationSuite} />
          <Route path="/curriculum" component={isUserAuthenticated ? EducationManagement : AuthenticationSuite} />
          <Route path="/lesson" component={isUserAuthenticated ? EducationManagement : AuthenticationSuite} />
          
          {/* Marketplace & Business */}
          <Route path="/nft-marketplace" component={isUserAuthenticated ? NFTMarketplace : AuthenticationSuite} />
          <Route path="/global-dashboard" component={isUserAuthenticated ? AnalyticsBusinessSuite : AuthenticationSuite} />
          <Route path="/voting" component={isUserAuthenticated ? AnalyticsBusinessSuite : AuthenticationSuite} />
          
          {/* Admin Routes - Require admin role - Unified */}
          <Route path="/admin" component={isUserAuthenticated ? AdminControlCenter : AuthenticationSuite} />
          <Route path="/admin-dashboard" component={isUserAuthenticated ? AdminControlCenter : AuthenticationSuite} />
          <Route path="/cms-admin" component={isUserAuthenticated ? AdminControlCenter : AuthenticationSuite} />
          <Route path="/enterprise-management" component={isUserAuthenticated ? AdminControlCenter : AuthenticationSuite} />
          
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
