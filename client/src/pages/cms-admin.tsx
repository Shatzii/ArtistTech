import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Upload, Settings, Image, ToggleLeft, ToggleRight,
  Save, Edit, Trash2, Plus, Monitor, Palette, 
  Globe, Shield, Eye, EyeOff
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CMSSetting {
  id: number;
  key: string;
  value: string;
  type: 'text' | 'image' | 'json' | 'boolean';
  category: string;
  description: string;
  isActive: boolean;
}

interface CMSFeature {
  id: number;
  key: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
  config: any;
}

interface CMSMedia {
  id: number;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  alt: string;
  caption: string;
  isPublic: boolean;
}

export default function CMSAdmin() {
  const [activeTab, setActiveTab] = useState('branding');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch CMS settings
  const { data: settings = [], isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/cms/settings'],
  });

  // Fetch CMS features
  const { data: features = [], isLoading: featuresLoading } = useQuery({
    queryKey: ['/api/cms/features'],
  });

  // Fetch CMS media
  const { data: media = [], isLoading: mediaLoading } = useQuery({
    queryKey: ['/api/cms/media'],
  });

  // Initialize CMS data
  const initializeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/cms/initialize'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cms/features'] });
    },
  });

  // Upload media mutation
  const uploadMediaMutation = useMutation({
    mutationFn: (formData: FormData) => apiRequest('POST', '/api/cms/media', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/media'] });
      setUploadFile(null);
      setLogoPreview('');
    },
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CMSSetting> }) =>
      apiRequest('PUT', `/api/cms/settings/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/settings'] });
    },
  });

  // Update feature mutation
  const updateFeatureMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CMSFeature> }) =>
      apiRequest('PUT', `/api/cms/features/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/features'] });
    },
  });

  useEffect(() => {
    // Initialize CMS if no settings exist
    if (!settingsLoading && settings.length === 0) {
      initializeMutation.mutate();
    }
  }, [settings, settingsLoading]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = () => {
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('alt', 'Artist Tech Logo');
    formData.append('caption', 'Main site logo');
    formData.append('isPublic', 'true');
    formData.append('tags', JSON.stringify(['logo', 'branding']));

    uploadMediaMutation.mutate(formData);
  };

  const handleFeatureToggle = (feature: CMSFeature) => {
    updateFeatureMutation.mutate({
      id: feature.id,
      data: { isEnabled: !feature.isEnabled }
    });
  };

  const handleSettingUpdate = (setting: CMSSetting, newValue: string) => {
    updateSettingMutation.mutate({
      id: setting.id,
      data: { value: newValue }
    });
  };

  const brandingSettings = settings.filter((s: CMSSetting) => s.category === 'branding');
  const featureSettings = settings.filter((s: CMSSetting) => s.category === 'features');
  const studioFeatures = features.filter((f: CMSFeature) => f.category === 'studio');
  const aiFeatures = features.filter((f: CMSFeature) => f.category === 'ai');
  const collaborationFeatures = features.filter((f: CMSFeature) => f.category === 'collaboration');
  const currentLogo = media.find((m: CMSMedia) => m.alt === 'Artist Tech Logo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="bg-black/30 border-b border-blue-500/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Settings className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CMS Administration
            </h1>
          </div>
          <div className="text-sm text-gray-300">
            Manage Artist Tech branding and features
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/20 border-b border-gray-700">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'branding', label: 'Branding & Logo', icon: Palette },
            { id: 'features', label: 'Site Features', icon: Monitor },
            { id: 'media', label: 'Media Library', icon: Image },
            { id: 'settings', label: 'Global Settings', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">
        {/* Branding & Logo Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-8">
            <div className="bg-gray-800/50 rounded-lg border border-blue-500/30 p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-6">Artist Tech Logo Management</h3>
              
              {/* Current Logo Display */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4">Current Logo</h4>
                {currentLogo ? (
                  <div className="bg-black/30 rounded-lg p-4 flex items-center space-x-4">
                    <img 
                      src={`/api/cms/media/${currentLogo.id}/serve`}
                      alt={currentLogo.alt}
                      className="w-24 h-24 object-contain bg-white/10 rounded"
                    />
                    <div>
                      <div className="font-semibold">{currentLogo.originalName}</div>
                      <div className="text-sm text-gray-400">
                        {(currentLogo.fileSize / 1024).toFixed(1)} KB • {currentLogo.mimeType}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/30 rounded-lg p-8 text-center border-2 border-dashed border-gray-600">
                    <Image className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <div className="text-gray-400">No logo uploaded yet</div>
                  </div>
                )}
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Upload New Logo</h4>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Select Logo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  {uploadFile && (
                    <button
                      onClick={handleLogoUpload}
                      disabled={uploadMediaMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{uploadMediaMutation.isPending ? 'Uploading...' : 'Upload Logo'}</span>
                    </button>
                  )}
                </div>

                {logoPreview && (
                  <div className="bg-black/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Preview:</div>
                    <img 
                      src={logoPreview} 
                      alt="Logo Preview" 
                      className="w-32 h-32 object-contain bg-white/10 rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Branding Settings */}
            <div className="bg-gray-800/50 rounded-lg border border-purple-500/30 p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-6">Branding Settings</h3>
              <div className="space-y-4">
                {brandingSettings.map((setting: CMSSetting) => (
                  <div key={setting.id} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-semibold">{setting.description}</label>
                      <span className="text-xs text-gray-400">{setting.key}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type={setting.type === 'boolean' ? 'checkbox' : 'text'}
                        value={setting.type === 'boolean' ? undefined : setting.value}
                        checked={setting.type === 'boolean' ? setting.value === 'true' : undefined}
                        onChange={(e) => {
                          const newValue = setting.type === 'boolean' 
                            ? e.target.checked.toString()
                            : e.target.value;
                          handleSettingUpdate(setting, newValue);
                        }}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-2 flex-1 text-white"
                        placeholder={`Enter ${setting.description.toLowerCase()}`}
                      />
                      {setting.type === 'text' && setting.key === 'theme_color' && (
                        <div 
                          className="w-10 h-10 rounded border border-gray-600"
                          style={{ backgroundColor: setting.value }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Site Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-8">
            {/* Studio Features */}
            <div className="bg-gray-800/50 rounded-lg border border-green-500/30 p-6">
              <h3 className="text-xl font-bold text-green-400 mb-6">Studio Features</h3>
              <div className="grid gap-4">
                {studioFeatures.map((feature: CMSFeature) => (
                  <div key={feature.id} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{feature.name}</div>
                      <div className="text-gray-400 text-sm">{feature.description}</div>
                      <div className="text-xs text-gray-500 mt-1">Key: {feature.key}</div>
                    </div>
                    <button
                      onClick={() => handleFeatureToggle(feature)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        feature.isEnabled
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {feature.isEnabled ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Features */}
            <div className="bg-gray-800/50 rounded-lg border border-cyan-500/30 p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-6">AI Features</h3>
              <div className="grid gap-4">
                {aiFeatures.map((feature: CMSFeature) => (
                  <div key={feature.id} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{feature.name}</div>
                      <div className="text-gray-400 text-sm">{feature.description}</div>
                      <div className="text-xs text-gray-500 mt-1">Key: {feature.key}</div>
                    </div>
                    <button
                      onClick={() => handleFeatureToggle(feature)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        feature.isEnabled
                          ? 'bg-cyan-600 hover:bg-cyan-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {feature.isEnabled ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaboration Features */}
            <div className="bg-gray-800/50 rounded-lg border border-orange-500/30 p-6">
              <h3 className="text-xl font-bold text-orange-400 mb-6">Collaboration Features</h3>
              <div className="grid gap-4">
                {collaborationFeatures.map((feature: CMSFeature) => (
                  <div key={feature.id} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{feature.name}</div>
                      <div className="text-gray-400 text-sm">{feature.description}</div>
                      <div className="text-xs text-gray-500 mt-1">Key: {feature.key}</div>
                    </div>
                    <button
                      onClick={() => handleFeatureToggle(feature)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        feature.isEnabled
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {feature.isEnabled ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Media Library Tab */}
        {activeTab === 'media' && (
          <div className="bg-gray-800/50 rounded-lg border border-yellow-500/30 p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-6">Media Library</h3>
            {mediaLoading ? (
              <div className="text-center py-8">Loading media...</div>
            ) : media.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No media files uploaded yet</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {media.map((item: CMSMedia) => (
                  <div key={item.id} className="bg-black/30 rounded-lg p-4">
                    {item.mimeType.startsWith('image/') ? (
                      <img
                        src={`/api/cms/media/${item.id}/serve`}
                        alt={item.alt}
                        className="w-full h-32 object-cover rounded mb-3"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-700 rounded mb-3 flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    <div className="text-sm">
                      <div className="font-semibold truncate">{item.originalName}</div>
                      <div className="text-gray-400">
                        {(item.fileSize / 1024).toFixed(1)} KB
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {item.isPublic ? (
                          <Eye className="w-3 h-3 text-green-400" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs">
                          {item.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Global Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800/50 rounded-lg border border-red-500/30 p-6">
            <h3 className="text-xl font-bold text-red-400 mb-6">Global Settings</h3>
            <div className="space-y-4">
              {featureSettings.map((setting: CMSSetting) => (
                <div key={setting.id} className="bg-black/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-semibold">{setting.description}</label>
                    <span className="text-xs text-gray-400">{setting.key}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type={setting.type === 'boolean' ? 'checkbox' : 'text'}
                      value={setting.type === 'boolean' ? undefined : setting.value}
                      checked={setting.type === 'boolean' ? setting.value === 'true' : undefined}
                      onChange={(e) => {
                        const newValue = setting.type === 'boolean' 
                          ? e.target.checked.toString()
                          : e.target.value;
                        handleSettingUpdate(setting, newValue);
                      }}
                      className="bg-gray-700 border border-gray-600 rounded px-3 py-2 flex-1 text-white"
                      placeholder={`Enter ${setting.description.toLowerCase()}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}