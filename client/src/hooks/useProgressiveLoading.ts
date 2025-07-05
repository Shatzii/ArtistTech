import { useState, useEffect } from 'react';

interface LoadingState {
  core: boolean;
  studios: boolean;
  ai: boolean;
  community: boolean;
}

interface ProgressiveLoadingHook {
  loadingState: LoadingState;
  isFullyLoaded: boolean;
  loadingProgress: number;
}

export function useProgressiveLoading(): ProgressiveLoadingHook {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    core: false,
    studios: false,
    ai: false,
    community: false
  });

  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Load core features immediately
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, core: true }));
      setLoadingProgress(25);
    }, 100);

    // Phase 2: Load studio interfaces
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, studios: true }));
      setLoadingProgress(50);
    }, 500);

    // Phase 3: Load AI engines in background
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, ai: true }));
      setLoadingProgress(75);
    }, 1500);

    // Phase 4: Load community features
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, community: true }));
      setLoadingProgress(100);
    }, 2000);
  }, []);

  const isFullyLoaded = Object.values(loadingState).every(Boolean);

  return {
    loadingState,
    isFullyLoaded,
    loadingProgress
  };
}