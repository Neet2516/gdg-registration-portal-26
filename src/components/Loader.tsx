import React, { useEffect, useState, useRef } from 'react';
import { checkBackendConnection } from '../services/api';
import { motion } from 'framer-motion';

// Import images to resolve their build URLs
import heroBackground from '../assets/images/hero-background.png';
import webRope from '../assets/images/web rope.png';
import gdgLogo from '../assets/images/gdg-logo.png';
import topLeftWeb from '../assets/images/top-left-web.png';
import topRightWeb from '../assets/images/top-right.png';
import spidermanHanging from '../assets/images/spiderman hanging.png';
import webBg from '../assets/images/web.png';
import spiderswingVideo from '../assets/video/spiderswing.mp4';

const IMAGES_TO_PRELOAD = [
  heroBackground,
  webRope,
  gdgLogo,
  topLeftWeb,
  topRightWeb,
  spidermanHanging,
  webBg
];

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [isZooming, setIsZooming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.currentTime = 1.5;
  };

  useEffect(() => {
    let loadedImages = 0;
    const totalImages = IMAGES_TO_PRELOAD.length;
    let backendReady = false;
    let assetsReady = false;
    let isCancelled = false;
    let isFinished = false;
    
    let holdTimeout: ReturnType<typeof setTimeout> | null = null;
    let zoomTimeout: ReturnType<typeof setTimeout> | null = null;
    let connectionTimeout: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;

    const startCompletionSequence = () => {
      if (isFinished || isCancelled) return;
      isFinished = true;

      // Pause for visual weight and pacing before zooming
      holdTimeout = setTimeout(() => {
        if (isCancelled) return;
        // Start Zooming animation
        setIsZooming(true);

        // Allow zoom animation to finish (900ms) before entering website
        zoomTimeout = setTimeout(() => {
          if (isCancelled) return;
          onComplete();
        }, 900);
      }, 600);
    };

    const checkAllReady = () => {
      if (assetsReady && backendReady) {
        startCompletionSequence();
      }
    };

    // 1. Preload Images
    IMAGES_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (isCancelled) return;
        loadedImages++;
        if (loadedImages === totalImages) {
          assetsReady = true;
          checkAllReady();
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loadedImages++;
        if (loadedImages === totalImages) {
          assetsReady = true;
          checkAllReady();
        }
      };
    });

    // 2. Preload/Check Backend connection
    const verifyConnection = async () => {
      await checkBackendConnection();
      if (isCancelled) return;

      backendReady = true;
      checkAllReady();
    };

    connectionTimeout = setTimeout(() => {
      verifyConnection();
    }, 400);

    // Fallback: Ensure loader completes even if backend or assets stall
    fallbackTimeout = setTimeout(() => {
      if (!isFinished && !isCancelled) {
        assetsReady = true;
        backendReady = true;
        startCompletionSequence();
      }
    }, 4000);

    return () => {
      isCancelled = true;
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (holdTimeout) clearTimeout(holdTimeout);
      if (zoomTimeout) clearTimeout(zoomTimeout);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020202] z-[9999] flex flex-col items-center justify-between select-none overflow-hidden p-6 md:p-12">
      
      {/* Full-screen Background Video - Hidden on mobile for clear black background performance */}
      <video
        ref={videoRef}
        src={spiderswingVideo}
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={handleVideoLoad}
        className="absolute inset-0 w-full h-full object-cover opacity-25 z-0 pointer-events-none transform-gpu"
      />

      {/* Massive Screen-Sized GDG Text Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-visible">
        
        {/* Horizontal on Desktop (tighter gap), Stacked Vertically on Mobile (tighter leading) */}
        {/* Zooms in dynamically when loading is completed after the hold pause */}
        <motion.h1 
          className="font-sans font-black uppercase text-white tracking-tighter text-shadow-glow flex flex-col sm:flex-row items-center justify-center text-[28vh] sm:text-[32vw] md:text-[30vw] leading-[0.75] sm:leading-none select-none gap-0 sm:gap-2"
          animate={isZooming ? { scale: 35, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{
            scale: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
            opacity: { duration: 0.6, ease: 'easeOut', delay: 0.15 }
          }}
          style={{
            textShadow: '0 0 50px rgba(225, 29, 72, 0.55)',
            transformOrigin: 'center center' // Zooms right through the center letter 'D'
          }}
        >
          <span>G</span>
          <span>D</span>
          <span>G</span>
        </motion.h1>

      </div>

    </div>
  );
};
