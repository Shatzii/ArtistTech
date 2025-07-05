import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  DollarSign, 
  Music, 
  Users, 
  Sparkles,
  Eye,
  Coins,
  Target,
  Award,
  CheckCircle,
  Zap
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  highlight: string;
  action: string;
  benefit: string;
  demoVideo?: string;
}

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingTutorial({ isOpen, onClose, onComplete }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Artist Tech!',
      description: 'The revolutionary platform where you actually make money while consuming content.',
      icon: Sparkles,
      highlight: 'FIRST platform to pay users for viewing content',
      action: 'Start your journey to earning real money',
      benefit: 'Earn ArtistCoins every minute you spend on the platform'
    },
    {
      id: 'pay-to-view',
      title: 'Revolutionary Pay-to-View Model',
      description: 'Unlike other platforms, we pay YOU for your attention and engagement.',
      icon: DollarSign,
      highlight: '10x higher payouts than Spotify ($50+ vs $3 per 1K plays)',
      action: 'Click "Start Earning" to begin accumulating ArtistCoins',
      benefit: 'Turn your social media time into real income'
    },
    {
      id: 'studios',
      title: '15 Professional AI Studios',
      description: 'Access industry-leading creation tools that surpass professional software.',
      icon: Music,
      highlight: 'Music, DJ, Video, Podcast, Visual Arts & more',
      action: 'Explore any studio to start creating professional content',
      benefit: 'Replace expensive software with one comprehensive platform'
    },
    {
      id: 'collaboration',
      title: 'Real-Time Collaboration',
      description: 'Work with artists worldwide in real-time. Share profits automatically.',
      icon: Users,
      highlight: 'Live editing, voice chat, and automatic revenue splits',
      action: 'Join collaborative projects or start your own',
      benefit: 'Build your network and create together profitably'
    },
    {
      id: 'earnings',
      title: 'Multiple Revenue Streams',
      description: 'Earn from viewing, creating, collaborating, streaming, and fan engagement.',
      icon: Coins,
      highlight: '13 different ways to monetize your presence',
      action: 'Check your earnings dashboard to track all income',
      benefit: 'Build sustainable creative income from day one'
    },
    {
      id: 'community',
      title: 'Global Artist Network',
      description: 'Connect with 50,000+ artists, producers, and creators worldwide.',
      icon: Target,
      highlight: 'Find collaborators, mentors, and fans instantly',
      action: 'Browse artist profiles and start networking',
      benefit: 'Accelerate your career through meaningful connections'
    }
  ];

  const isLastStep = currentStep === tutorialSteps.length - 1;
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const handleNext = () => {
    const currentStepId = tutorialSteps[currentStep].id;
    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps(prev => [...prev, currentStepId]);
    }

    if (isLastStep) {
      onComplete();
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const startDemo = () => {
    setIsPlaying(true);
    // Simulate demo video playing
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  if (!isOpen) return null;

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 text-white">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{step.title}</h2>
                  <p className="text-gray-400 text-sm">Step {currentStep + 1} of {tutorialSteps.length}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Main Description */}
            <p className="text-gray-300 text-lg mb-6">{step.description}</p>

            {/* Highlight Feature */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Key Feature</span>
              </div>
              <p className="text-white font-medium">{step.highlight}</p>
            </div>

            {/* Action Item */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-semibold">Try This</span>
              </div>
              <p className="text-gray-300">{step.action}</p>
            </div>

            {/* Benefit */}
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-semibold">Your Benefit</span>
              </div>
              <p className="text-green-200">{step.benefit}</p>
            </div>

            {/* Interactive Demo Section */}
            {step.id === 'pay-to-view' && (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold mb-1">Live Demo: Start Earning Now</h3>
                    <p className="text-green-100 text-sm">Watch your earnings grow in real-time</p>
                  </div>
                  <Button 
                    onClick={startDemo}
                    disabled={isPlaying}
                    className="bg-white text-green-600 hover:bg-gray-100"
                  >
                    {isPlaying ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full mr-2" />
                        Earning...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Try Demo
                      </>
                    )}
                  </Button>
                </div>
                {isPlaying && (
                  <div className="mt-4 p-3 bg-white/10 rounded">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">+$0.15</div>
                      <div className="text-green-200 text-sm">Earned in 3 seconds!</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step Completion Indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index < currentStep 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-blue-500' 
                        : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="text-gray-400 hover:text-white"
              >
                Skip Tutorial
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Creating!
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}