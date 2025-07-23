import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCheck, Music, Upload, Award, Star, 
  Verified, DollarSign, Users, TrendingUp,
  Globe, Crown, Zap, Shield, Link, CheckCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function RealArtistOnboarding() {
  const [artistName, setArtistName] = useState("");
  const [realName, setRealName] = useState("");
  const [email, setEmail] = useState("");
  const [genre, setGenre] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    spotify: "",
    apple: "",
    instagram: "",
    tiktok: "",
    youtube: ""
  });
  const [verificationDocs, setVerificationDocs] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const verificationSteps = [
    { step: 1, title: "Basic Info", description: "Artist details and contact" },
    { step: 2, title: "Music Catalog", description: "Link your existing releases" },
    { step: 3, title: "Verification", description: "Verify your identity" },
    { step: 4, title: "Revenue Setup", description: "Configure payments" },
    { step: 5, title: "Launch", description: "Go live on platform" }
  ];

  const genres = [
    "Hip-Hop/Rap", "Pop", "R&B/Soul", "Rock", "Electronic/EDM", 
    "Country", "Jazz", "Folk/Acoustic", "Classical", "Reggae",
    "Latin", "Alternative", "Indie", "Blues", "Gospel"
  ];

  const verificationBenefits = [
    { 
      icon: Verified, 
      title: "Blue Checkmark", 
      description: "Official verified artist status across all platforms" 
    },
    { 
      icon: DollarSign, 
      title: "10x Higher Payouts", 
      description: "$50+ per 1K plays vs Spotify's $3" 
    },
    { 
      icon: TrendingUp, 
      title: "Priority Algorithm", 
      description: "Verified artists get 5x more visibility" 
    },
    { 
      icon: Crown, 
      title: "Premium Features", 
      description: "Access to AI agents, advanced analytics, direct fan funding" 
    },
    { 
      icon: Users, 
      title: "Label Connections", 
      description: "Direct access to A&R scouts from major labels" 
    },
    { 
      icon: Globe, 
      title: "Global Distribution", 
      description: "Instant distribution to 41 platforms worldwide" 
    }
  ];

  const { data: artistData } = useQuery({
    queryKey: ["/api/artists/onboarding"],
    enabled: true
  });

  const verifyArtistMutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append('artistName', data.artistName);
      formData.append('realName', data.realName);
      formData.append('email', data.email);
      formData.append('genre', data.genre);
      formData.append('bio', data.bio);
      formData.append('socialLinks', JSON.stringify(data.socialLinks));
      
      data.verificationDocs.forEach((file: File, index: number) => {
        formData.append(`verificationDoc${index}`, file);
      });

      const response = await fetch('/api/artists/verify', {
        method: 'POST',
        body: formData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists/onboarding"] });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setVerificationDocs([...verificationDocs, ...files]);
  };

  const handleSubmitVerification = async () => {
    if (!artistName || !realName || !email || !genre) return;

    setIsVerifying(true);
    try {
      await verifyArtistMutation.mutateAsync({
        artistName,
        realName,
        email,
        genre,
        bio,
        socialLinks,
        verificationDocs
      });
      setCurrentStep(5);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const updateSocialLink = (platform: string, url: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: url }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <UserCheck className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Artist Verification Center</h1>
            <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-lg px-4 py-2">
              VERIFIED ARTISTS ONLY
            </Badge>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the ranks of verified artists earning 10x more than Spotify. Get your blue checkmark and unlock premium features.
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              {verificationSteps.map((step, index) => (
                <div key={step.step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.step ? 'bg-blue-600 border-blue-600' : 'border-gray-600'
                  }`}>
                    {currentStep > step.step ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-white font-bold">{step.step}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-white font-medium">{step.title}</div>
                    <div className="text-gray-400 text-sm">{step.description}</div>
                  </div>
                  {index < verificationSteps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-600 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Onboarding Form */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={`step${currentStep}`} className="space-y-6">
              {/* Step 1: Basic Info */}
              <TabsContent value="step1" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Music className="w-5 h-5 mr-2 text-blue-400" />
                      Artist Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Artist/Stage Name</label>
                        <Input
                          placeholder="e.g., Drake, Taylor Swift"
                          value={artistName}
                          onChange={(e) => setArtistName(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Real Name</label>
                        <Input
                          placeholder="Your legal name"
                          value={realName}
                          onChange={(e) => setRealName(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Email</label>
                        <Input
                          type="email"
                          placeholder="artist@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Primary Genre</label>
                        <Select value={genre} onValueChange={setGenre}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Artist Bio</label>
                      <Textarea
                        placeholder="Tell us about your music journey, achievements, and style..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                      />
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(2)}
                      disabled={!artistName || !realName || !email || !genre}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Music Catalog
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 2: Music Catalog */}
              <TabsContent value="step2" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Link className="w-5 h-5 mr-2 text-purple-400" />
                      Connect Your Music
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Link your existing music on streaming platforms for verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(socialLinks).map(([platform, url]) => (
                      <div key={platform}>
                        <label className="text-white text-sm font-medium mb-2 block capitalize">
                          {platform} Profile URL
                        </label>
                        <Input
                          placeholder={`https://${platform}.com/your-profile`}
                          value={url}
                          onChange={(e) => updateSocialLink(platform, e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    ))}

                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => setCurrentStep(1)}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        Continue to Verification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 3: Verification */}
              <TabsContent value="step3" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-400" />
                      Identity Verification
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload documents to verify your identity as a real artist
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">
                        Required Documents (Choose at least 2)
                      </label>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {[
                          "Government ID",
                          "Music Publishing Agreement",
                          "Record Label Contract",
                          "Performance Rights Organization (PRO) Registration",
                          "Verified Social Media Screenshots",
                          "Music Distribution Receipts"
                        ].map((doc) => (
                          <div key={doc} className="p-3 bg-gray-700 rounded-lg">
                            <div className="text-white text-sm">{doc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div 
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-white mb-2">Upload Verification Documents</p>
                      <p className="text-xs text-gray-400">PNG, JPG, PDF accepted</p>
                    </div>

                    {verificationDocs.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-white text-sm font-medium">Uploaded Files:</p>
                        {verificationDocs.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-700 rounded">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-white text-sm">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => setCurrentStep(2)}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmitVerification}
                        disabled={verificationDocs.length < 2 || isVerifying}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isVerifying ? (
                          <>
                            <Zap className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Submit for Verification
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Step 5: Success */}
              <TabsContent value="step5" className="space-y-6">
                <Card className="bg-gradient-to-r from-green-800 to-blue-800 border-green-500">
                  <CardContent className="p-8 text-center">
                    <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-2">Verification Submitted!</h2>
                    <p className="text-green-100 text-lg mb-6">
                      Your application is being reviewed by our team. You'll receive an email within 24-48 hours.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 text-lg py-3">
                        <Star className="w-5 h-5 mr-2" />
                        Explore Artist Dashboard
                      </Button>
                      <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                        Join Artist Community
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Verification Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {verificationBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <benefit.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{benefit.title}</div>
                      <div className="text-gray-400 text-xs">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Why Verify?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <p>• Earn <span className="text-green-400 font-bold">10x more</span> than Spotify</p>
                <p>• Get discovered by <span className="text-blue-400 font-bold">major labels</span></p>
                <p>• Access <span className="text-purple-400 font-bold">AI career agents</span></p>
                <p>• Build direct <span className="text-yellow-400 font-bold">fan relationships</span></p>
                <p>• Global <span className="text-orange-400 font-bold">distribution network</span></p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}