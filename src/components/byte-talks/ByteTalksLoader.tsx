import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { checkBackendConnection } from '../../services/api';

// Key ByteTalks assets to preload for seamless rendering
import compassAsset from '../../assets/images/byte-talks/compass.svg';
import posterAsset from '../../assets/images/byte-talks/byte_talks_poster.png';
import micAsset from '../../assets/images/byte-talks/mic-asset.png';
import arrowAsset from '../../assets/images/byte-talks/ArrowMarker.png';
import speaker1Asset from '../../assets/images/speakers/speaker1.png';
import speaker2Asset from '../../assets/images/speakers/speaker2.png';

const ASSETS_TO_PRELOAD = [
  compassAsset,
  posterAsset,
  micAsset,
  arrowAsset,
  speaker1Asset,
  speaker2Asset,
];

interface ByteTalksLoaderProps {
  onComplete: () => void;
}

export const ByteTalksLoader: React.FC<ByteTalksLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);
  const [statusMessage, setStatusMessage] = useState('BOOTING SYSTEM ENVIRONMENT...');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'standby'>('checking');
  const [assetsLoadedCount, setAssetsLoadedCount] = useState(0);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    let loadedAssets = 0;
    const totalAssets = ASSETS_TO_PRELOAD.length;
    let backendReady = false;
    let assetsReady = false;
    let isCancelled = false;

    // Preload image assets
    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      const handleLoad = () => {
        if (isCancelled) return;
        loadedAssets++;
        setAssetsLoadedCount(loadedAssets);
        // Progress reaches up to 75% purely via asset prefetching
        const assetProgress = Math.round(15 + (loadedAssets / totalAssets) * 55);
        setProgress((prev) => Math.max(prev, assetProgress));

        if (loadedAssets === totalAssets) {
          assetsReady = true;
          setStatusMessage('ASSETS CACHED // VERIFYING SECURE GATEWAY...');
          checkAllDone();
        } else {
          setStatusMessage(`PREFETCHING KEYNOTE ASSETS [${loadedAssets}/${totalAssets}]...`);
        }
      };

      img.onload = handleLoad;
      img.onerror = handleLoad;
    });

    // Check backend gateway availability
    const verifyBackend = async () => {
      setStatusMessage('CONNECTING TO SECURE REGISTRATION BACKEND...');
      try {
        const isOnline = await checkBackendConnection();
        if (isCancelled) return;
        setBackendStatus(isOnline ? 'online' : 'standby');
        backendReady = true;
        setProgress((prev) => Math.max(prev, 90));
        setStatusMessage(isOnline ? 'GATEWAY CONNECTED // ALL SYSTEMS NOMINAL' : 'GATEWAY STANDBY // OFFLINE READY');
        checkAllDone();
      } catch {
        if (isCancelled) return;
        setBackendStatus('standby');
        backendReady = true;
        checkAllDone();
      }
    };

    const backendTimeout = setTimeout(verifyBackend, 350);

    const checkAllDone = () => {
      if (assetsReady && backendReady && !hasFinishedRef.current) {
        setProgress(100);
        setStatusMessage('INITIALIZATION COMPLETE // LAUNCHING PORTAL...');
        hasFinishedRef.current = true;
        setTimeout(() => {
          if (!isCancelled) onComplete();
        }, 650);
      }
    };

    // Hard fallback timeout: never let user wait more than 3.2s
    const fallbackTimeout = setTimeout(() => {
      if (!hasFinishedRef.current && !isCancelled) {
        hasFinishedRef.current = true;
        setProgress(100);
        setStatusMessage('SYSTEM READY // ENTERING BYTE TALKS...');
        setTimeout(() => {
          if (!isCancelled) onComplete();
        }, 400);
      }
    }, 3200);

    return () => {
      isCancelled = true;
      clearTimeout(backendTimeout);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete]);

  return (
    <motion.aside
      key="bytetalks-loader"
      initial={{ opacity: 1 }}
      exit={{
        y: '-100%',
        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
      }}
      aria-label="Loading Byte Talks Portal"
      aria-busy="true"
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#1B1F27] text-white select-none overflow-hidden"
    >
      {/* Top Hazard Accent Line */}
      <div 
        className="h-3.5 sm:h-4 w-full bg-[repeating-linear-gradient(-45deg,#1c242b,#1c242b_10px,#ffffff_10px,#ffffff_20px)] border-b-2 border-[#1c242b]" 
        aria-hidden="true" 
      />

      {/* Main Center Console */}
      <div className="relative z-10 mx-auto w-full max-w-xl px-4 py-8 flex flex-col items-center justify-center my-auto">
        {/* Terminal Window Box */}
        <div className="w-full bg-[#1c242b] border-2 border-white/20 shadow-[8px_8px_0_#de432c] p-6 sm:p-8 relative">
          {/* Window Header */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#de432c]" />
              <span className="size-3 rounded-full bg-[#f2c35b]" />
              <span className="size-3 rounded-full bg-[#387A5B]" />
              <span className="ml-2 font-mono text-[0.68rem] tracking-wider text-white/50 uppercase">
                GDG_AKGEC // BOOT_LOADER_v2.6
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-[#55a8a8] animate-pulse">
              [ LIVE ]
            </span>
          </div>

          {/* Large Title */}
          <div className="text-center mb-6">
            <span className="font-mono text-[0.7rem] font-bold text-[#55a8a8] tracking-[0.25em] uppercase block mb-1">
              AJAY KUMAR GARG ENGINEERING COLLEGE
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-white m-0">
              BYTE TALKS
            </h1>
            <span className="font-mono text-xs font-bold text-[#de432c] tracking-widest mt-1 block uppercase">
              2026 EDITION • FLAGSHIP FORUM
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="mb-6">
            <div className="flex items-center justify-between font-mono text-xs font-bold mb-2">
              <span className="text-white/70 tracking-wider">SYSTEM INITIALIZATION</span>
              <span className="text-[#de432c] font-black text-sm">{progress}%</span>
            </div>
            
            {/* Outer Progress Frame */}
            <div className="w-full h-5 sm:h-6 bg-[#14181F] border-2 border-white/30 p-0.5 relative overflow-hidden">
              <motion.div
                className="h-full bg-[#de432c] relative"
                initial={{ width: '12%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {/* Diagonal stripes on the progress bar */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(255,255,255,0.2)_6px,rgba(255,255,255,0.2)_12px)]" />
              </motion.div>
            </div>
          </div>

          {/* Terminal Status Output */}
          <div className="bg-[#14181F] border border-white/10 p-3 sm:p-3.5 mb-6 font-mono text-[0.72rem] sm:text-xs text-white/80 flex items-center gap-2">
            <span className="text-[#55a8a8] font-black">{'>'}</span>
            <span className="truncate">{statusMessage}</span>
            <span className="inline-block size-2 bg-[#55a8a8] animate-ping ml-auto shrink-0" />
          </div>

          {/* Status Diagnostic Badges */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10 font-mono text-[0.62rem] sm:text-[0.68rem] font-bold">
            {/* Backend Pill */}
            <div className="bg-white/5 border border-white/10 p-2">
              <span className="block text-white/40 text-[0.55rem] uppercase mb-0.5">GATEWAY</span>
              <span className={`inline-flex items-center gap-1 ${backendStatus === 'online' ? 'text-[#387A5B]' : backendStatus === 'standby' ? 'text-[#f2c35b]' : 'text-white/60'}`}>
                <span className={`size-1.5 rounded-full ${backendStatus === 'online' ? 'bg-[#387A5B]' : backendStatus === 'standby' ? 'bg-[#f2c35b]' : 'bg-white/40 animate-ping'}`} />
                {backendStatus === 'online' ? 'ONLINE' : backendStatus === 'standby' ? 'STANDBY' : 'SYNCING'}
              </span>
            </div>

            {/* Assets Pill */}
            <div className="bg-white/5 border border-white/10 p-2">
              <span className="block text-white/40 text-[0.55rem] uppercase mb-0.5">ASSETS</span>
              <span className="text-[#55a8a8]">
                {assetsLoadedCount}/{ASSETS_TO_PRELOAD.length} READY
              </span>
            </div>

            {/* Event Telemetry Pill */}
            <div className="bg-white/5 border border-white/10 p-2">
              <span className="block text-white/40 text-[0.55rem] uppercase mb-0.5">VENUE</span>
              <span className="text-white/90">
                CSIT HALL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hazard Accent Line */}
      <div 
        className="h-3.5 sm:h-4 w-full bg-[repeating-linear-gradient(-45deg,#1c242b,#1c242b_10px,#ffffff_10px,#ffffff_20px)] border-t-2 border-[#1c242b]" 
        aria-hidden="true" 
      />
    </motion.aside>
  );
};
