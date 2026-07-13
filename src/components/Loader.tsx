import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { checkBackendConnection } from '../services/api';

// Import images to resolve their build URLs
import heroBackground from '../assets/images/hero-background.png';
import webRope from '../assets/images/web rope.png';
import gdgLogo from '../assets/images/gdg-logo.png';
import topLeftWeb from '../assets/images/top-left-web.png';
import topRightWeb from '../assets/images/top-right.png';
import spidermanHanging from '../assets/images/spiderman hanging.png';
import webBg from '../assets/images/web.png';

import img1 from '../assets/images/gdg-last-glimpses/DSC04065.jpg';
import img2 from '../assets/images/gdg-last-glimpses/DSC04127.jpg';
import img3 from '../assets/images/gdg-last-glimpses/DSC04282.jpg';
import img4 from '../assets/images/gdg-last-glimpses/DSC04294.jpg';
import img5 from '../assets/images/gdg-last-glimpses/DSC04415.jpg';
import img6 from '../assets/images/gdg-last-glimpses/DSC04436.jpg';
import img7 from '../assets/images/gdg-last-glimpses/DSC04444.jpg';
import img8 from '../assets/images/gdg-last-glimpses/DSC04447.jpg';
import img9 from '../assets/images/gdg-last-glimpses/DSC04498.jpg';
import img10 from '../assets/images/gdg-last-glimpses/DSC04507.jpg';

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
  img9,
  img10
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
      
      {/* Spiderweb Background Graphic */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08] pointer-events-none z-0 mix-blend-screen"
        style={{ backgroundImage: `url(${webBg})` }}
      />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:30px_30px] opacity-35" />
      
      {/* Background Pulse Red Glow */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-red-600/10 blur-[80px] animate-pulse pointer-events-none" />

      {/* Hanging Spiderman Web Rope */}
      <motion.div
        className="absolute top-0 left-1/2 w-[2px] bg-gradient-to-b from-[#E11D48] via-[#EF4444] to-[#7C3AED] -translate-x-1/2 z-10 origin-top"
        animate={{ 
          height: `${Math.min(50, 20 + (progress / 100) * 30)}vh`,
          rotate: [0, 1.5, -1.5, 0]
        }}
        transition={{ 
          height: { type: "spring", stiffness: 70, damping: 14 },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
        }}
      />

      {/* Upside-Down Hanging Spiderman */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20 origin-top w-28 sm:w-32 pointer-events-none"
        animate={{ 
          top: `${Math.min(50, 20 + (progress / 100) * 30)}vh`,
          rotate: [0, 1.5, -1.5, 0]
        }}
        transition={{ 
          top: { type: "spring", stiffness: 70, damping: 14 },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          marginTop: '-15px'
        }}
      >
        <img 
          src={spidermanHanging} 
          alt="Hanging Spiderman" 
          className="w-full h-auto drop-shadow-[0_10px_20px_rgba(239,68,68,0.55)]"
        />
      </motion.div>

      {/* Progress & Status Container positioned near bottom of screen */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center z-30">
        
        {/* Cyber Title */}
        <h2 className="title-spiderman text-xl sm:text-2xl font-black tracking-[0.25em] text-white uppercase text-shadow-glow mb-1">
          GDG Portal
        </h2>

        {/* Progress Bar */}
        <div className="w-56 sm:w-64 h-1 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>

        {/* Percentage read-out */}
        <div className="mt-2.5 font-mono text-[9px] tracking-[0.25em] text-zinc-400">
          SPIDER-LINK STATUS: <span className="text-white font-bold">{progress}%</span>
        </div>

        {/* Interactive status feed */}
        <div className="mt-3 max-w-[280px] text-center px-4">
          <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 line-clamp-1">
            {statusText}
          </p>
        </div>
      </div>

      {/* Retro CRT edge overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-50"></div>

      {/* Cyberpunk corner bracket markings */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-zinc-800" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-zinc-800" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-zinc-800" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-zinc-800" />

    </div>
  );
};
