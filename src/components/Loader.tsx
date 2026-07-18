import React, { useEffect, useState } from 'react';
import { checkBackendConnection } from '../services/api';

// Import images to resolve their build URLs
import heroBackground from '../assets/images/hero-background.png';
import webRope from '../assets/images/web rope.png';
import gdgLogo from '../assets/images/gdg-logo.png';
import topLeftWeb from '../assets/images/top-left-web.png';
import topRightWeb from '../assets/images/top-right.png';
import spidermanHanging from '../assets/images/spiderman hanging.png';
import webBg from '../assets/images/web.png';
import spiderswingVideo from '../assets/video/spiderswing.mp4';

import img1 from '../assets/images/gdg-last-glimpses/image1.jpg';
import img2 from '../assets/images/gdg-last-glimpses/image2.jpg';
import img3 from '../assets/images/gdg-last-glimpses/image3.jpg';
import img4 from '../assets/images/gdg-last-glimpses/image4.jpg';
import img5 from '../assets/images/gdg-last-glimpses/image5.jpg';
import img6 from '../assets/images/gdg-last-glimpses/image6.jpg';
import img7 from '../assets/images/gdg-last-glimpses/image7.jpg';
import img8 from '../assets/images/gdg-last-glimpses/image8.jpg';
import img9 from '../assets/images/gdg-last-glimpses/image9.jpg';

const IMAGES_TO_PRELOAD = [
  heroBackground,
  webRope,
  gdgLogo,
  topLeftWeb,
  topRightWeb,
  spidermanHanging,
  webBg,
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9
];

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Web-Shooters...');

  useEffect(() => {
    if (progress >= 100) {
      setStatusText('Connection synchronized. System operational.');
    } else if (progress >= 75) {
      setStatusText('Establishing neural link to backend database...');
    } else if (progress >= 50) {
      setStatusText('Preloading memories & gallery assets...');
    } else if (progress >= 25) {
      setStatusText('Decrypting Spider-Verse Files...');
    } else {
      setStatusText('Initializing Web-Shooters...');
    }
  }, [progress]);

  useEffect(() => {
    let loadedImages = 0;
    const totalImages = IMAGES_TO_PRELOAD.length;
    let backendReady = false;
    let assetsReady = false;
    let isCancelled = false;
    let completionTimeout: ReturnType<typeof setTimeout> | null = null;
    let connectionTimeout: ReturnType<typeof setTimeout> | null = null;

    const checkComplete = (currentProgress: number) => {
      if (currentProgress >= 100 && !completionTimeout) {
        completionTimeout = setTimeout(() => {
          onComplete();
        }, 800);
      }
    };

    // 1. Preload Images
    IMAGES_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (isCancelled) {
          return;
        }

        loadedImages++;
        const imageProgress = Math.floor((loadedImages / totalImages) * 75); // Max 75% for images
        setProgress((prev) => {
          const next = Math.max(prev, imageProgress);
          checkComplete(next);
          return next;
        });
        if (loadedImages === totalImages) {
          assetsReady = true;
          if (backendReady) {
            setProgress(100);
            checkComplete(100);
          }
        }
      };
      img.onerror = () => {
        if (isCancelled) {
          return;
        }

        loadedImages++;
        const imageProgress = Math.floor((loadedImages / totalImages) * 75);
        setProgress((prev) => {
          const next = Math.max(prev, imageProgress);
          checkComplete(next);
          return next;
        });
      };
    });

    // 2. Preload/Check Backend connection
    const verifyConnection = async () => {
      const isConnected = await checkBackendConnection();
      if (isCancelled) {
        return;
      }

      backendReady = true;
      if (isConnected) {
        setProgress((prev) => {
          const next = prev < 75 ? 75 : prev;
          const finalVal = assetsReady ? 100 : next + 15;
          checkComplete(finalVal);
          return finalVal;
        });
      } else {
        setProgress((prev) => {
          const next = prev < 75 ? 75 : prev;
          const finalVal = assetsReady ? 100 : next + 15;
          checkComplete(finalVal);
          return finalVal;
        });
      }
    };

    connectionTimeout = setTimeout(() => {
      verifyConnection();
    }, 600);

    return () => {
      isCancelled = true;
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      if (completionTimeout) {
        clearTimeout(completionTimeout);
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020202] z-[9999] flex flex-col items-center justify-center select-none overflow-hidden">
      
      {/* Full-screen Background Video */}
      <video
        src={spiderswingVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-65 z-0 pointer-events-none transform-gpu"
      />

      {/* Progress & Status Container positioned near bottom of screen */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center z-30">
        
        {/* Cyber Title */}
        <h2 className="title-spiderman text-xl sm:text-2xl font-black tracking-[0.25em] text-white uppercase text-shadow-glow mb-2">
          GDG Portal
        </h2>

        {/* Percentage read-out */}
        <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-400">
          SPIDER-LINK STATUS: <span className="text-white font-bold">{progress}%</span>
        </div>

        {/* Interactive status feed */}
        <div className="mt-3 max-w-[280px] text-center px-4">
          <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 line-clamp-1">
            {statusText}
          </p>
        </div>
      </div>

    </div>
  );
};
