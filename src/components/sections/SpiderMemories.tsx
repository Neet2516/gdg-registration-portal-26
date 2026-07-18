import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import webSpiderImg from '../../assets/images/web-spider.png';

// Import all 10 existing images from gdg-last-glimpses
import img1 from '../../assets/images/gdg-last-glimpses/DSC04065.jpg';
import img2 from '../../assets/images/gdg-last-glimpses/DSC04127.jpg';
import img3 from '../../assets/images/gdg-last-glimpses/DSC04282.jpg';
import img4 from '../../assets/images/gdg-last-glimpses/DSC04294.jpg';
import img5 from '../../assets/images/gdg-last-glimpses/DSC04415.jpg';
import img6 from '../../assets/images/gdg-last-glimpses/DSC04436.jpg';
import img7 from '../../assets/images/gdg-last-glimpses/DSC04444.jpg';
import img8 from '../../assets/images/gdg-last-glimpses/DSC04447.jpg';
import img9 from '../../assets/images/gdg-last-glimpses/DSC04498.jpg';
import img10 from '../../assets/images/gdg-last-glimpses/DSC04507.jpg';

// Strongly typed MemoryItem structure
export interface MemoryItem {
  id: string;
  image: string;
}

const MEMORIES: MemoryItem[] = [
  {
    id: '1',
    image: img1,
  },
  {
    id: '2',
    image: img2,
  },
  {
    id: '3',
    image: img3,
  },
  {
    id: '4',
    image: img4,
  },
  {
    id: '5',
    image: img5,
  },
  {
    id: '6',
    image: img6,
  },
  {
    id: '7',
    image: img7,
  },
  {
    id: '8',
    image: img8,
  },
  {
    id: '9',
    image: img9,
  },
  {
    id: '10',
    image: img10,
  },
];

// Color helper mappings for borders, tags, shadows, and headers
const themeColors = {
  red: {
    text: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/35',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]',
    hoverBorder: 'hover:border-red-500',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]',
    tagText: 'text-red-400',
    tagBorder: 'border-red-500/30',
    accentLine: 'bg-red-500',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  blue: {
    text: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/35',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.25)]',
    hoverBorder: 'hover:border-blue-500',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]',
    tagText: 'text-blue-400',
    tagBorder: 'border-blue-500/30',
    accentLine: 'bg-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  purple: {
    text: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/35',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    hoverBorder: 'hover:border-purple-500',
    hoverGlow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    tagText: 'text-purple-400',
    tagBorder: 'border-purple-500/30',
    accentLine: 'bg-purple-500',
    glowColor: 'rgba(168, 85, 247, 0.4)',
  },
};

const MemoryCard: React.FC<{
  memory: MemoryItem;
  isEven: boolean;
  accentColor: 'red' | 'blue' | 'purple';
}> = ({ memory, isEven, accentColor }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const colorTheme = themeColors[accentColor];

  // Track the scroll position of the card relative to the viewport
  // "start end" -> top of card enters bottom of viewport (scrollYProgress = 0)
  // "start start" -> top of card reaches top of viewport (scrollYProgress = 1)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // Grayscale: 
  // - Starts at 100% grayscale (1.0)
  // - When card top touches around 30% viewport height (0.7 progress), it starts transitioning to color
  // - Reaches full color (0.0 grayscale) by 25% viewport height (0.75 progress) and stays color
  const grayscaleVal = useTransform(smoothProgress, [0, 0.7, 0.75, 1.0], [1, 1, 0, 0]);

  // Opacity:
  // - Starts at 1 (fully visible)
  // - Stays 1 until card top is at 10% viewport height (0.9 progress)
  // - Fades to 0 (fully transparent) by 0% viewport height (1.0 progress)
  const opacityVal = useTransform(smoothProgress, [0, 0.9, 1.0], [1, 1, 0]);

  const filterStyle = useTransform(grayscaleVal, (g) => `grayscale(${g * 100}%)`);

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col md:flex-row items-start ${
        isEven ? 'md:justify-start' : 'md:justify-end'
      } w-full pl-12 md:pl-0`}
    >
      {/* Left / Right Card alignment wrapper */}
      <div className={`w-full md:w-[46%] ${isEven ? 'md:pr-10' : 'md:pl-10'}`}>
        <motion.div
          style={{
            opacity: opacityVal,
            transformStyle: 'preserve-3d',
          }}
          initial={{
            x: isEven ? -40 : 40,
            scale: 0.95,
          }}
          whileInView={{
            x: 0,
            scale: 1,
          }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            type: 'spring',
            stiffness: 70,
            damping: 14,
            delay: 0.05,
          }}
          whileHover="hover"
          className={`group relative rounded-[16px] border-2 border-zinc-800 bg-[#0d0d10] p-4 shadow-2xl transition-colors duration-300 cursor-pointer overflow-hidden transform-gpu will-change-transform-opacity ${colorTheme.hoverBorder} ${colorTheme.hoverGlow}`}
        >
          {/* Comic Halftone Overlay (inside card background) */}
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px) bg-[size:10px_10px] pointer-events-none opacity-40" />

          {/* Parallax Image Frame */}
          <div className="relative aspect-video rounded-[10px] overflow-hidden border border-zinc-800 bg-zinc-950 z-10">
            <motion.img
              src={memory.image}
              alt={`GDG Memory ${memory.id}`}
              style={{
                filter: filterStyle,
              }}
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.08 },
              }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 15,
              }}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform-gpu will-change-filter"
            />
            
            {/* Diagonal Shine Sweep overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-20" />
            
            {/* Comic Shadow Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none z-10 opacity-70" />
          </div>

          {/* Accent corner brackets */}
          <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-800 group-hover:border-white transition-colors duration-300`} />
          <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-800 group-hover:border-white transition-colors duration-300`} />
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-800 group-hover:border-white transition-colors duration-300`} />
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-800 group-hover:border-white transition-colors duration-300`} />
        </motion.div>
      </div>

      {/* Desktop connecting silk thread node */}
      <div className="hidden md:flex absolute left-1/2 top-8 w-6 h-6 rounded-full border-2 border-zinc-800 bg-[#0a0a0c] z-20 -translate-x-1/2 items-center justify-center">
        <motion.div
          variants={{
            initial: { scale: 0.5, backgroundColor: '#27272a' },
            hover: {
              scale: 1,
              backgroundColor: accentColor === 'red' ? '#ef4444' : accentColor === 'blue' ? '#3b82f6' : '#a855f7',
              boxShadow: `0 0 10px ${accentColor === 'red' ? '#ef4444' : accentColor === 'blue' ? '#3b82f6' : '#a855f7'}`,
            },
          }}
          className="w-3.5 h-3.5 rounded-full transition-all duration-300"
        />
      </div>
    </div>
  );
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const MobileMemories: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 375);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const colors: ('red' | 'blue' | 'purple')[] = ['red', 'blue', 'purple'];
  const activeColor = colors[activeIndex % 3];
  const activeColorTheme = themeColors[activeColor];

  const CARD_WIDTH = 260;
  const CARD_GAP = 12;
  const centeringOffset = (windowWidth - CARD_WIDTH) / 2;

  return (
    <div className="relative w-full py-2 flex flex-col items-center overflow-hidden z-10">
      
      {/* Horizontal Drag Slider Track Container */}
      <div 
        className="w-full relative h-[300px] flex items-center overflow-visible"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Projector Light Beam shining from the top center of track onto active screen */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[250px] pointer-events-none z-0 opacity-20"
          style={{
            background: 'conic-gradient(from 180deg at 50% 0%, rgba(255, 255, 255, 0.18) 0deg, transparent 20deg, transparent 340deg, rgba(255, 255, 255, 0.18) 360deg)',
            filter: 'blur(8px)',
            transformOrigin: 'top center',
            transform: 'scaleY(1.2)'
          }}
        />

        {/* Ambient floor reflection directly under the center active card slot */}
        <div 
          className="absolute bottom-[24px] left-1/2 -translate-x-1/2 w-[200px] h-[8px] rounded-full blur-[6px] opacity-35 transition-all duration-500 pointer-events-none z-0"
          style={{
            backgroundColor: activeColorTheme.glowColor,
            boxShadow: `0 0 16px 8px ${activeColorTheme.glowColor}`
          }}
        />

        <motion.div
          drag="x"
          dragConstraints={{
            left: -((MEMORIES.length - 1) * (CARD_WIDTH + CARD_GAP)),
            right: 0
          }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const dragOffset = info.offset.x;
            const dragVelocity = info.velocity.x;
            
            let newIndex = activeIndex;
            // Snap based on threshold or swipe velocity
            if (dragOffset < -50 || dragVelocity < -200) {
              newIndex = Math.min(MEMORIES.length - 1, activeIndex + 1);
            } else if (dragOffset > 50 || dragVelocity > 200) {
              newIndex = Math.max(0, activeIndex - 1);
            }
            setActiveIndex(newIndex);
          }}
          animate={{
            x: -activeIndex * (CARD_WIDTH + CARD_GAP) + centeringOffset
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 20
          }}
          className="flex items-center gap-3 cursor-grab active:cursor-grabbing"
          style={{
            touchAction: 'none', // Prevent scrolling page while swiping slider
            transformStyle: 'preserve-3d'
          }}
        >
          {MEMORIES.map((memory, idx) => {
            const isActive = idx === activeIndex;
            const isLeft = idx < activeIndex;
            const cardColor = colors[idx % 3];
            const colorTheme = themeColors[cardColor];

            return (
              <motion.div
                key={memory.id}
                onClick={() => {
                  if (!isActive) setActiveIndex(idx);
                }}
                animate={{
                  scale: isActive ? 1.0 : 0.88,
                  opacity: isActive ? 1.0 : 0.35,
                  rotateY: isActive ? 0 : (isLeft ? 20 : -20),
                  z: isActive ? 0 : -80
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 18
                }}
                className={`group relative shrink-0 rounded-[16px] border-2 bg-[#0d0d10] p-3 shadow-2xl transition-colors duration-300 overflow-hidden transform-gpu will-change-transform-opacity ${
                  isActive ? `${colorTheme.border} ${colorTheme.glow}` : 'border-zinc-800'
                }`}
                style={{
                  width: `${CARD_WIDTH}px`,
                  height: '240px',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                {/* Comic Halftone Overlay */}
                <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px) bg-[size:10px_10px] pointer-events-none opacity-40" />

                {/* Image Frame */}
                <div className="relative w-full h-full rounded-[10px] overflow-hidden border border-zinc-900 bg-zinc-950">
                  <img
                    src={memory.image}
                    alt={`GDG Memory ${memory.id}`}
                    className={`w-full h-full object-cover pointer-events-none transition-all duration-500 ${
                      isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-60'
                    }`}
                  />
                  {/* Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none z-10 opacity-70" />
                  
                  {/* Shine Sweep overlay on active */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-20" />
                  )}
                </div>

                {/* Decorative Brackets */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${isActive ? 'border-white' : 'border-zinc-700'}`} />
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${isActive ? 'border-white' : 'border-zinc-700'}`} />
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${isActive ? 'border-white' : 'border-zinc-700'}`} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${isActive ? 'border-white' : 'border-zinc-700'}`} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Cinematic Shadow vignette fades on sides */}
      <div className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-[#030303] to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#030303] to-transparent z-20 pointer-events-none" />

    </div>
  );
};

export const SpiderMemories: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Set up scroll linked animation thread tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Smooth out the progress indicator values using springs
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  // Track the vertical thread filling height
  const threadHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // Move the crawler spider along the thread based on scroll
  const spiderY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  
  // Rotate the spider slightly during scroll velocity
  const spiderRotate = useTransform(smoothProgress, [0, 0.5, 1], [0, 12, 0]);

  // Move a spider horizontally across the page based on scroll
  const spiderX = useTransform(smoothProgress, [0, 1], ['-10%', '110%']);

  const titleWords = "SPIDER MEMORIES".split(" ");
  const wordContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  const letterVar: any = {
    hidden: { opacity: 0, y: 15, scale: 1.3 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

  return (
    <section
      id="spider-memories"
      ref={containerRef}
      className="scroll-mt-24 py-16 bg-[#030303] text-white overflow-hidden relative"
    >
      {/* Background Cyberpunk Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370d_1px,transparent_1px),linear-gradient(to_bottom,#1f29370d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0 opacity-40" />
      <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_20%,#030303_100%) pointer-events-none z-0" />

      {/* Horizontal background thread with a crawling spider */}
      <div className="absolute top-[240px] left-0 right-0 h-[1px] bg-zinc-900/40 pointer-events-none z-10">
        <motion.div
          className="absolute w-36 h-36 -translate-y-1/2 pointer-events-none"
          style={{
            left: spiderX,
            rotate: 90, // Oriented head-first horizontally
          }}
        >
          <img
            src={webSpiderImg}
            alt="Horizontal Crawling Spider"
            className="w-full h-full object-contain opacity-70"
            style={{
              filter: 'invert(1) sepia(1) saturate(7000%) hue-rotate(345deg) drop-shadow(0 0 16px rgba(239, 68, 68, 0.75))'
            }}
          />
        </motion.div>
      </div>

      {/* Halftone vignette borders */}
      <div className="absolute inset-0 dither-bg opacity-5 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-16 relative flex flex-col items-center justify-center gap-y-3">
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-4 relative z-10"
            variants={wordContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {titleWords.map((word, wIdx) => (
              <span key={wIdx} className="flex overflow-hidden py-1">
                {Array.from(word).map((char, cIdx) => (
                  <motion.span 
                    key={cIdx} 
                    className="title-spiderman text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase select-none tracking-tight text-shadow-glow"
                    variants={letterVar}
                    style={{
                      textShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {isMobile ? (
        <MobileMemories />
      ) : (
        /* Timeline Track Container */
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="relative mt-16 min-h-[400px]">
            
            {/* Central Thread Spine */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[3px] bg-zinc-900 -translate-x-1/2 z-10">
              {/* Active Thread fill */}
              <motion.div
                className="absolute top-0 w-full bg-gradient-to-b from-[#E11D48] via-[#7C3AED] to-[#2563EB] shadow-[0_0_10px_rgba(225,29,72,0.8)]"
                style={{ height: threadHeight }}
              />

              {/* Scrolling Crawler Spider Indicator */}
              <motion.div
                className="absolute w-48 h-[600px] pointer-events-none z-20"
                style={{
                  top: spiderY,
                  left: '50%',
                  x: '-50%',
                  y: '-92%', // Align spider body center to the timeline node
                  rotate: spiderRotate,
                }}
              >
                <img
                  src={webSpiderImg}
                  alt="Scrolling Spider Indicator"
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'invert(1) sepia(1) saturate(7000%) hue-rotate(345deg) drop-shadow(0 0 24px rgba(239, 68, 68, 0.95))'
                  }}
                />
              </motion.div>
            </div>

            {/* Chronological Cards List */}
            <div className="space-y-16">
              {MEMORIES.map((memory, index) => {
                const isEven = index % 2 === 0;
                const colors: ('red' | 'blue' | 'purple')[] = ['red', 'blue', 'purple'];
                const accentColor = colors[index % 3];

                return (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    isEven={isEven}
                    accentColor={accentColor}
                  />
                );
              })}
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
