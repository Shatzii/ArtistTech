import { useState, useEffect } from 'react';

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'chrome' | 'safari' | 'firefox' | 'edge' | 'unknown';
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
  hasTouch: boolean;
  orientation: 'portrait' | 'landscape';
  viewport: {
    width: number;
    height: number;
  };
  capabilities: {
    webgl: boolean;
    webrtc: boolean;
    webAudio: boolean;
    vibration: boolean;
    gyroscope: boolean;
    camera: boolean;
    microphone: boolean;
  };
  performance: 'low' | 'medium' | 'high';
  connection: {
    type: string;
    speed: 'slow' | 'medium' | 'fast';
  };
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    os: 'unknown',
    browser: 'unknown',
    screenSize: 'large',
    hasTouch: false,
    orientation: 'landscape',
    viewport: { width: 1920, height: 1080 },
    capabilities: {
      webgl: false,
      webrtc: false,
      webAudio: false,
      vibration: false,
      gyroscope: false,
      camera: false,
      microphone: false,
    },
    performance: 'medium',
    connection: { type: 'unknown', speed: 'medium' },
  });

  useEffect(() => {
    const detectDevice = async () => {
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Detect device type
      const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent);
      const isTablet = /iPad|Android.*(?!.*Mobile)/i.test(userAgent) || (width >= 768 && width <= 1024);
      const deviceType = isMobile && !isTablet ? 'mobile' : isTablet ? 'tablet' : 'desktop';

      // Detect OS
      let os: DeviceInfo['os'] = 'unknown';
      if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'ios';
      else if (/Android/i.test(userAgent)) os = 'android';
      else if (/Windows/i.test(userAgent)) os = 'windows';
      else if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'macos';
      else if (/Linux/i.test(userAgent)) os = 'linux';

      // Detect browser
      let browser: DeviceInfo['browser'] = 'unknown';
      if (/Chrome/i.test(userAgent)) browser = 'chrome';
      else if (/Safari/i.test(userAgent)) browser = 'safari';
      else if (/Firefox/i.test(userAgent)) browser = 'firefox';
      else if (/Edge/i.test(userAgent)) browser = 'edge';

      // Screen size classification
      let screenSize: DeviceInfo['screenSize'] = 'medium';
      if (width < 640) screenSize = 'small';
      else if (width < 1024) screenSize = 'medium';
      else if (width < 1440) screenSize = 'large';
      else screenSize = 'xlarge';

      // Detect capabilities
      const capabilities = {
        webgl: !!(window.WebGLRenderingContext && document.createElement('canvas').getContext('webgl')),
        webrtc: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        webAudio: !!(window.AudioContext || (window as any).webkitAudioContext),
        vibration: 'vibrate' in navigator,
        gyroscope: 'DeviceOrientationEvent' in window,
        camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      };

      // Performance estimation based on device specs
      let performance: DeviceInfo['performance'] = 'medium';
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as any).deviceMemory || 4;
      
      if (cores >= 8 && memory >= 8) performance = 'high';
      else if (cores >= 4 && memory >= 4) performance = 'medium';
      else performance = 'low';

      // Connection speed estimation
      const connection = (navigator as any).connection || { effectiveType: '4g' };
      let speed: 'slow' | 'medium' | 'fast' = 'medium';
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') speed = 'slow';
      else if (connection.effectiveType === '3g') speed = 'medium';
      else speed = 'fast';

      setDeviceInfo({
        type: deviceType,
        os,
        browser,
        screenSize,
        hasTouch: 'ontouchstart' in window,
        orientation: width > height ? 'landscape' : 'portrait',
        viewport: { width, height },
        capabilities,
        performance,
        connection: {
          type: connection.effectiveType || 'unknown',
          speed,
        },
      });
    };

    detectDevice();

    // Update on resize and orientation change
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceInfo(prev => ({
        ...prev,
        viewport: { width, height },
        orientation: width > height ? 'landscape' : 'portrait',
        screenSize: width < 640 ? 'small' : width < 1024 ? 'medium' : width < 1440 ? 'large' : 'xlarge',
      }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}