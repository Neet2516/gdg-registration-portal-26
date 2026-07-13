import { useEffect, useRef, useState } from 'react';
import { Globe, Database, Cpu, Binary, Compass, Network, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import webRope from '../../assets/images/web rope.png';

gsap.registerPlugin(ScrollTrigger);

interface GuildData {
  id: string;
  title: string;
  icon: any;
  color: string;
  shadowColor: string;
  description: string;
}

const GUILDS: GuildData[] = [
  {
    id: 'frontend',
    title: 'Frontend Dev',
    icon: Globe,
    color: '#E11D48',
    shadowColor: 'rgba(225, 29, 72, 0.4)',
    description: 'Craft cinematic web interfaces, user experiences, and fluid micro-animations that amaze users at first glance.'
  },
  {
    id: 'backend',
    title: 'Backend Dev',
    icon: Database,
    color: '#2563EB',
    shadowColor: 'rgba(37, 99, 235, 0.4)',
    description: 'Build bulletproof logic engines, scalable database grids, and secure API networks to keep the entire system online.'
  },
  {
    id: 'ai',
    title: 'AI & ML',
    icon: Cpu,
    color: '#7C3AED',
    shadowColor: 'rgba(124, 58, 237, 0.4)',
    description: 'Deploy deep learning models, natural language processing pipelines, and computer vision scripts that drive intelligence.'
  },
  {
    id: 'app',
    title: 'App Dev',
    icon: Binary,
    color: '#38BDF8',
    shadowColor: 'rgba(56, 189, 248, 0.4)',
    description: 'Design and code mobile portals that deliver the power of our network straight into the hands of users.'
  },
  {
    id: 'design',
    title: 'UI/UX Design',
    icon: Compass,
    color: '#FACC15',
    shadowColor: 'rgba(250, 204, 21, 0.4)',
    description: 'Illustrate branding schemes, draft user flow maps, shape halftone comic frames, and design visual multiverses.'
  },
  {
    id: 'managerial',
    title: 'Managerial & PR',
    icon: Network,
    color: '#10B981',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
    description: 'Lead team collaborations, run development sprints, direct public relations, and maintain organizational balance.'
  }
];

export const Domains = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const skylineFarRef = useRef<HTMLDivElement>(null);
  const skylineNearRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const titleWords = "CHOOSE YOUR GUILD".split(" ");
  const wordContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  const letterVar: any = {
    hidden: { opacity: 0, y: 15, filter: "blur(6px)", scale: 1.3 },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const scrollElement = scrollRef.current;
    const exitElement = exitRef.current;
    if (!container || !scrollElement || !exitElement) return;

    const getHorizontalTranslation = () => scrollElement.scrollWidth - window.innerWidth;
    const getPinnedScrollDistance = () => scrollElement.scrollWidth * 1.5;

    const ctx = gsap.context(() => {
      // Pin section and scroll the track horizontally
      gsap.to(scrollElement, {
        x: () => -getHorizontalTranslation(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${getPinnedScrollDistance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const cardCount = GUILDS.length;
            
            // Calculate active index based on scroll position
            const centerCard = Math.min(
              cardCount - 1,
              Math.max(0, Math.floor(progress * cardCount + 0.5))
            );
            setActiveIndex(centerCard);
          }
        }
      });

      // Exit only after the pinned horizontal pass is complete and the card band
      // begins moving above the viewport center.
      gsap.to(exitElement, {
        opacity: 0,
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: () => `top+=${getPinnedScrollDistance() + 1} top`,
          end: () => `+=${window.innerHeight * 0.5}`,
          scrub: true,
          invalidateOnRefresh: true,
        }
      });

      // Background Parallax Effects: Far skyline moves slower than near skyline
      gsap.to(skylineFarRef.current, {
        x: () => -getHorizontalTranslation() * 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${getPinnedScrollDistance()}`
        }
      });

      gsap.to(skylineNearRef.current, {
        x: () => -getHorizontalTranslation() * 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${getPinnedScrollDistance()}`
        }
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      id="domains" 
      className="relative w-full h-screen overflow-hidden bg-black flex flex-col justify-center select-none"
    >
      
      {/* 1. Cinematic Background Layer */}
      {/* Ambient Moving Fog */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(15,16,22,0.9),rgba(0,0,0,1))] z-0"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-red-900/10 to-blue-900/10 blur-[150px] animate-[pulse_10s_infinite_alternate]"></div>
      
      {/* Animated Neon Spiderweb background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="webglow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Neon web connections */}
          <path d="M 0,0 L 500,500 M 1000,0 L 500,500 M 500,500 L 500,1000 M 0,1000 L 500,500 M 1000,1000 L 500,500" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="500" cy="500" r="300" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="500" cy="500" r="150" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="500" cy="500" r="450" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* 2. Parallax City Skyline at Bottom */}
      {/* Far Skyline Layer */}
      <div 
        ref={skylineFarRef}
        className="absolute bottom-0 left-0 w-[200vw] h-[25vh] opacity-15 pointer-events-none z-0"
      >
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-zinc-700">
          <path d="M 0,100 L 0,60 L 30,60 L 30,50 L 50,50 L 50,65 L 80,65 L 80,40 L 120,40 L 120,70 L 150,70 L 150,30 L 180,30 L 180,60 L 220,60 L 220,55 L 260,55 L 260,75 L 300,75 L 300,45 L 340,45 L 340,65 L 380,65 L 380,35 L 420,35 L 420,70 L 460,70 L 460,50 L 500,50 L 500,100 Z" />
          <path d="M 500,100 L 500,60 L 530,60 L 530,50 L 550,50 L 550,65 L 580,65 L 580,40 L 620,40 L 620,70 L 650,70 L 650,30 L 680,30 L 680,60 L 720,60 L 720,55 L 760,55 L 760,75 L 800,75 L 800,45 L 840,45 L 840,65 L 880,65 L 880,35 L 920,35 L 920,70 L 960,70 L 960,50 L 1000,50 L 1000,100 Z" />
        </svg>
      </div>
      
      {/* Near Skyline Layer */}
      <div 
        ref={skylineNearRef}
        className="absolute bottom-0 left-0 w-[250vw] h-[18vh] opacity-25 pointer-events-none z-0"
      >
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-black">
          <path d="M 0,100 L 0,80 L 40,80 L 40,65 L 70,65 L 70,85 L 110,85 L 110,55 L 160,55 L 160,90 L 200,90 L 200,70 L 250,70 L 250,85 L 300,85 L 300,60 L 350,60 L 350,90 L 400,90 L 400,75 L 450,75 L 450,100 Z" />
          <path d="M 450,100 L 450,80 L 490,80 L 490,65 L 520,65 L 520,85 L 560,85 L 560,55 L 610,55 L 610,90 L 650,90 L 650,70 L 700,70 L 700,85 L 750,85 L 750,60 L 800,60 L 800,90 L 850,90 L 850,75 L 900,75 L 900,100 Z" />
        </svg>
      </div>

      {/* 3. Section Title Sticky Container */}
      <div className="absolute top-12 left-0 right-0 text-center z-10 px-8 mb-10">
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

      {/* 4. Horizontal Scroll Track Wrapper */}
      <div 
        ref={exitRef}
        className="w-full h-[65vh] relative z-10 flex items-center justify-start overflow-visible"
      >
        <div 
          ref={scrollRef} 
          className="flex items-center gap-16 md:gap-32 pl-[25vw] pr-[15vw] md:pr-[35vw] h-[65vh] w-fit relative"
        >
        
        {/* Horizontal cable running through the top anchors */}
        <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none select-none z-10 opacity-40">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="horizontal-web-rope"
                width="480"
                height="80"
                patternUnits="userSpaceOnUse"
                patternTransform="translate(0, 80) rotate(-90)"
              >
                <image
                  href={webRope}
                  width="80"
                  height="480"
                  preserveAspectRatio="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#horizontal-web-rope)" />
          </svg>
          {/* Edge fades to blend nicely with the background */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60 pointer-events-none" />
        </div>

        {GUILDS.map((guild, idx) => {
          const Icon = guild.icon;
          const isActive = idx === activeIndex;
          const hasBeenActive = idx <= activeIndex;

          return (
            <div 
              key={guild.id}
              className="flex flex-col items-center pt-24 relative select-none w-[75vw] max-w-[340px] md:w-[28vw] shrink-0"
            >
              
              {/* Vertical web rope cable hanging card */}
              <img 
                src={webRope} 
                alt="Web Rope" 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-24 object-fill pointer-events-none select-none z-20"
                style={{
                  opacity: hasBeenActive ? 0.9 : 0.4,
                  filter: hasBeenActive ? `drop-shadow(0 0 5px ${guild.color})` : 'none'
                }}
              />
              
              {/* Pulsing web node junction */}
              <div 
                className={`absolute top-[88px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white z-30 transition-all duration-300 ${
                  isActive ? 'scale-125 animate-ping' : 'scale-100'
                }`}
                style={{ backgroundColor: guild.color }}
              ></div>
              <div 
                className="absolute top-[88px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white z-30 transition-all duration-300 shadow-md"
                style={{ 
                  backgroundColor: guild.color,
                  boxShadow: isActive ? `0 0 10px ${guild.color}` : 'none'
                }}
              ></div>

              {/* Suspended Guild Card */}
              <motion.div
                className={`w-full relative rounded-2xl transition-all duration-500 cursor-pointer ${
                  isActive 
                    ? 'scale-105 md:scale-110 z-20 opacity-100 blur-none' 
                    : hasBeenActive
                    ? 'scale-100 z-10 opacity-100 blur-none'
                    : 'scale-90 opacity-40 z-10 blur-[6px] pointer-events-none'
                }`}
                animate={isActive ? {
                  y: [0, -10, 0],
                  rotateZ: [0, 0.5, 0, -0.5, 0]
                } : { y: 0, rotateZ: 0 }}
                transition={isActive ? {
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  rotateZ: { repeat: Infinity, duration: 5, ease: "easeInOut" }
                } : undefined}
              >
                
                {/* Comic style neon shadow backdrop */}
                <div 
                  className="absolute inset-0 rounded-2xl pointer-events-none translate-x-[6px] translate-y-[6px] transition-all duration-300"
                  style={{ 
                    backgroundColor: guild.color,
                    opacity: isActive ? 0.85 : 0.2,
                    boxShadow: isActive ? `0 0 35px ${guild.shadowColor}` : 'none'
                  }}
                ></div>

                {/* Main Card Container */}
                <div className="relative border-2 border-white rounded-2xl p-6 bg-zinc-950/95 overflow-hidden text-left h-[45vh] md:h-[48vh] flex flex-col justify-between select-none">
                  
                  {/* Comic book halftone pattern overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-repeat halftone-bg"></div>

                  <div className="space-y-4 relative z-10">

                    {/* Guild Title */}
                    <div className="space-y-1">
                      <h3 className="font-oswald text-2xl md:text-3xl text-white uppercase flex items-center gap-2.5">
                        <Icon size={22} style={{ color: guild.color }} />
                        {guild.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-md text-zinc-400 leading-relaxed">
                      {guild.description}
                    </p>

                  </div>

                  {/* Actions / Enrollment (Visible on active cards) */}
                  <div className="space-y-4 relative z-10 border-t border-zinc-800/80 pt-4">
                    
                    {/* Call to action element */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.a 
                          href="#registration-terminal"
                          className="flex items-center justify-between font-mono text-[10px] uppercase text-white hover:underline pt-2 w-full"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span style={{ color: guild.color }} className="font-bold flex items-center gap-1.5">
                            INITIALIZE ENROLLMENT <ArrowRight size={10} />
                          </span>
                          
                        </motion.a>
                      )}
                    </AnimatePresence>

                  </div>

                </div>
              </motion.div>

            </div>
          );
        })}

        </div>
      </div>
    </section>
  );
};
