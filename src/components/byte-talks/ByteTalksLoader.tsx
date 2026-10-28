import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { checkBackendConnection } from '../../services/api';

// Key ByteTalks assets to preload in the background
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

const TARGET_TEXT = 'BYTE TALKS';

interface ByteTalksLoaderProps {
  onComplete: () => void;
}

export const ByteTalksLoader: React.FC<ByteTalksLoaderProps> = ({ onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;
    let typingComplete = false;
    let assetsComplete = false;
    let backendComplete = false;
    let loadedCount = 0;

    // 1. Typewriter effect for "BYTE TALKS"
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (isCancelled) return;
      charIndex++;
      setDisplayedText(TARGET_TEXT.slice(0, charIndex));

      if (charIndex >= TARGET_TEXT.length) {
        clearInterval(typeInterval);
        typingComplete = true;
        checkAndProceed();
      }
    }, 85);

    // 2. Background resource preloading
    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;
      const onLoadOrError = () => {
        if (isCancelled) return;
        loadedCount++;
        if (loadedCount === ASSETS_TO_PRELOAD.length) {
          assetsComplete = true;
          checkAndProceed();
        }
      };
      img.onload = onLoadOrError;
      img.onerror = onLoadOrError;
    });

    // 3. Background backend check
    checkBackendConnection()
      .catch(() => false)
      .finally(() => {
        if (isCancelled) return;
        backendComplete = true;
        checkAndProceed();
      });

    const checkAndProceed = () => {
      // Proceed once typing is finished and assets + backend check are done
      if (typingComplete && assetsComplete && backendComplete && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setTimeout(() => {
          if (!isCancelled) onComplete();
        }, 400);
      }
    };

    // Fallback: Ensure loader never blocks past 2.4s even if assets/backend hang
    const fallbackTimeout = setTimeout(() => {
      if (!hasFinishedRef.current && !isCancelled) {
        hasFinishedRef.current = true;
        setDisplayedText(TARGET_TEXT);
        setTimeout(() => {
          if (!isCancelled) onComplete();
        }, 300);
      }
    }, 2400);

    return () => {
      isCancelled = true;
      clearInterval(typeInterval);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete]);

  return (
    <motion.aside
      key="bytetalks-typewriter-loader"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.02,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      aria-label="Loading Byte Talks"
      aria-busy="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1B1F27] text-white select-none overflow-hidden px-4"
    >
      <div className="flex items-center justify-center text-center">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight m-0 inline-flex items-center">
          <span>{displayedText}</span>
          <span 
            className="inline-block text-[#de432c] animate-pulse ml-1.5 sm:ml-2 font-mono font-normal"
            aria-hidden="true"
          >
            _
          </span>
        </h1>
      </div>
    </motion.aside>
  );
};
