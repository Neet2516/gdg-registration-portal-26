import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { checkBackendConnection } from '../services/api';

// Import images to resolve their build URLs
import heroBackground from '../assets/images/hero-background.png';
import webRope from '../assets/images/web rope.png';
import gdgLogo from '../assets/images/gdg-logo.png';
import topLeftWeb from '../assets/images/top-left-web.png';
import topRightWeb from '../assets/images/top-right.png';

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
  const [statusText, setStatusText] = useState('Initializing Portal...');

  useEffect(() => {
    let loadedImages = 0;
    const totalImages = IMAGES_TO_PRELOAD.length;
    let backendReady = false;
    let assetsReady = false;

    const checkComplete = (currentProgress: number) => {
      if (currentProgress >= 100) {
        // Delay a bit for visual gratification
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    };

    // 1. Preload Images
    setStatusText('Downloading cyber assets...');
    IMAGES_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
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
            setStatusText('Neural link fully synchronized.');
            checkComplete(100);
          } else {
            setStatusText('Connecting neural network to backend database...');
          }
        }
      };
      img.onerror = () => {
        // Continue even if an image fails to load to prevent blocking
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
      backendReady = true;
      if (isConnected) {
        setProgress((prev) => {
          const next = prev < 75 ? 75 : prev; // Jump to at least 75%
          // If assets are already ready, we complete to 100%
          const finalVal = assetsReady ? 100 : next + 15;
          if (finalVal === 100) {
            setStatusText('Neural link established. System operational.');
          }
          checkComplete(finalVal);
          return finalVal;
        });
      } else {
        // Fallback to offline mode
        setStatusText('API unresponsive. Initializing local override...');
        setProgress((prev) => {
          const next = prev < 75 ? 75 : prev;
          const finalVal = assetsReady ? 100 : next + 15;
          checkComplete(finalVal);
          return finalVal;
        });
      }
    };

    // Verify connection after a tiny delay
    setTimeout(() => {
      verifyConnection();
    }, 600);

  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020202] z-[9999] flex flex-col items-center justify-center select-none overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:30px_30px] opacity-35" />
      
      {/* Subtle pulse red glow */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-red-600/10 blur-[80px] animate-pulse pointer-events-none" />

      {/* Cyberpunk Spider logo */}
      <div className="relative mb-6">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.7)]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path
              d="M12 2C10.9 2 10 2.9 10 4C10 4.4 10.1 4.7 10.3 5H13.7C13.9 4.7 14 4.4 14 4C14 2.9 13.1 2 12 2ZM8.8 8C8.4 8 8.1 8.3 8.1 8.7C8.1 9.1 8.4 9.4 8.8 9.4H9.4V11.2C9.4 12.7 10.6 13.9 12 13.9C13.4 13.9 14.6 12.7 14.6 11.2V9.4H15.2C15.6 9.4 15.9 9.1 15.9 8.7C15.9 8.3 15.6 8 15.2 8H8.8ZM12 15C8.7 15 6 12.3 6 9C6 7.3 6.7 5.8 7.8 4.7L6.4 3.3C4.9 4.8 4 6.8 4 9C4 13.1 7.1 16.5 11 16.9V20C7.1 20 4 20.9 4 22V23H20V22C20 20.9 16.9 20 13 20V16.9C16.9 16.5 20 13.1 20 9C20 6.8 19.1 4.8 17.6 3.3L16.2 4.7C17.3 5.8 18 7.3 18 9C18 12.3 15.3 15 12 15Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      </div>

      {/* Cyber title */}
      <h2 className="title-spiderman text-2xl font-black tracking-widest text-white uppercase text-shadow-glow">
        GDG Portal
      </h2>

      {/* Retro CRT edge overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-50"></div>

      {/* Progress Bar */}
      <div className="w-64 h-1.5 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden mt-6 relative shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      {/* Percentage read-out */}
      <div className="mt-3 font-mono text-[10px] tracking-[0.25em] text-zinc-400">
        SYSTEM LOAD: <span className="text-white font-bold">{progress}%</span>
      </div>

      {/* Interactive status feed */}
      <div className="mt-4 max-w-xs text-center px-4">
        <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-500 line-clamp-1">
          {statusText}
        </p>
      </div>

      {/* Cyberpunk corner bracket markings */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-zinc-800" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-zinc-800" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-zinc-800" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-zinc-800" />

    </div>
  );
};
