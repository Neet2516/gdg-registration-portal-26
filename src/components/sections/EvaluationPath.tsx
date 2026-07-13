import { useEffect, useRef, useState } from 'react';
import { Cpu, Binary, Globe, Code2, Database, Compass, Network } from 'lucide-react';
import { CodeChip } from '../CodeChip';
import { motion } from 'framer-motion';
import { SYLLABUS_MATRIX } from '../../constants/recruitment';
import spiderWebPathImage from '../../assets/images/spider web image.jpg';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MissionCardProps {
  stage: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  focusVectors: string;
  children: React.ReactNode;
  themeColor: 'red' | 'blue';
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  stage,
  title,
  icon: Icon,
  color,
  focusVectors,
  children,
  themeColor,
  cardRef
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const tiltX = (yc - y) / 12; // 3D tilt limit
    const tiltY = (x - xc) / 12;
    
    setTilt({ x: tiltX, y: tiltY });
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const activeGlow = themeColor === 'red'
    ? 'rgba(225, 29, 72, 0.4)'
    : 'rgba(37, 99, 235, 0.4)';

  return (
    <div
      ref={cardRef}
      className="w-full relative group transition-all duration-300 ease-out select-none rounded-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? '-10px' : '0px'})`,
        boxShadow: isHovered 
          ? `0 25px 50px -12px ${activeGlow}, 0 0 25px -2px ${color}50` 
          : `0 10px 30px -15px rgba(0, 0, 0, 0.8)`,
      }}
    >
      {/* 3D holographic shadow sweep border */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-[1px] rounded-xl bg-zinc-950/90 backdrop-blur-2xl z-10" />
        
        {/* Conic sweep element */}
        <div 
          className="absolute inset-[-150%] bg-[conic-gradient(from_0deg,transparent_30%,var(--sweep-color)_50%,transparent_70%)] animate-[border-rotate_4s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ '--sweep-color': color } as React.CSSProperties}
        />
        
        {/* Default subtle border */}
        <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-transparent transition-colors duration-300" />
      </div>
      
      {/* Mouse reflection shimmer overlay */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden z-20"
        style={{
          background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 80%)`
        }}
      />

      {/* Halftone pattern overlay */}
      <div className="absolute inset-0 rounded-xl opacity-[0.03] pointer-events-none bg-repeat halftone-bg z-10" />

      {/* Internal fast energy particles (faster on hover) */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 4 }).map((_, i) => {
          const delay = i * 2;
          const left = `${15 + i * 20}%`;
          const size = `${1.5 + Math.random() * 2}px`;
          const sway = `${-20 + Math.random() * 40}px`;
          return (
            <div
              key={i}
              className="absolute bottom-2 rounded-full card-particle opacity-40"
              style={{
                left,
                width: size,
                height: size,
                backgroundColor: color,
                animationDelay: `${delay}s`,
                '--sway-x': sway,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Card Content */}
      <div className="relative z-20 p-6 md:p-8 flex flex-col justify-between h-full min-h-[360px] items-center text-center">
        
        {/* Centered status & phase tag */}
        <div className="flex flex-col items-center mb-4">
          <span 
            className="font-mono text-lg md:text-xl font-black tracking-widest uppercase block"
            style={{ color }}
          >
            {stage}
          </span>
        </div>

        {/* Centered Title */}
        <h3 className="font-oswald text-xl md:text-2xl font-normal tracking-wide text-white uppercase flex flex-col sm:flex-row items-center justify-center gap-3 border-b border-zinc-800/80 pb-4 mb-4 w-full">
          <Icon size={24} className="transition-transform duration-500 group-hover:rotate-12" style={{ color }} />
          <span>{title}</span>
        </h3>

        {/* Centered Focus vectors */}
        <div className="space-y-1 text-center mb-4 w-full">
          <p className="font-sans text-sm text-zinc-300 leading-relaxed">
            {focusVectors}
          </p>
        </div>

        {/* Custom Inner Child Content */}
        <div className="flex-1 w-full flex flex-col justify-center items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export const EvaluationPath = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const bgWebRef = useRef<SVGSVGElement>(null);
  const fog1Ref = useRef<HTMLDivElement>(null);
  const fog2Ref = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger orchestration
  useEffect(() => {
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const container = containerRef.current;

    if (!card1 || !card2 || !container) return;

    const ctx = gsap.context(() => {
      // 1. Entrance timeline (plays once automatically when scrolled into view)
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      });

      entranceTl.fromTo(card1, 
        { opacity: 0, x: -40, filter: 'blur(6px)', scale: 0.96 },
        { opacity: 1, x: 0, filter: 'blur(0px)', scale: 1, duration: 0.8, ease: 'power2.out' }
      );

      entranceTl.fromTo(card2,
        { opacity: 0, x: 40, filter: 'blur(6px)', scale: 0.96 },
        { opacity: 1, x: 0, filter: 'blur(0px)', scale: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      );

      // 2. Parallax timeline (runs across the entire section viewport lifetime)
      const parallaxTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      if (bgWebRef.current) {
        parallaxTl.to(bgWebRef.current, { y: -50, scale: 1.03, ease: 'none' }, 0);
      }
      if (fog1Ref.current) {
        parallaxTl.to(fog1Ref.current, { y: -70, x: -35, ease: 'none' }, 0);
      }
      if (fog2Ref.current) {
        parallaxTl.to(fog2Ref.current, { y: 70, x: 35, ease: 'none' }, 0);
      }

    }, container);

    return () => ctx.revert();
  }, []);



  // Framer Motion staggered configs
  const titleWords = "RECRUITMENT EVALUATION PATH".split(" ");
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

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 110,
        damping: 12
      }
    }
  };

  return (
    <section id="evaluation-path" className="scroll-mt-24 space-y-8 pt-16 relative overflow-hidden" ref={containerRef}>
      
      {/* Self-contained styling module */}
      <style>{`
        @keyframes border-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-380px) translateX(var(--sway-x, 20px)) scale(0); opacity: 0; }
        }
        @keyframes float-fog-1 {
          0% { transform: translate(-3%, -3%) scale(1); }
          50% { transform: translate(3%, 3%) scale(1.04); }
          100% { transform: translate(-3%, -3%) scale(1); }
        }
        @keyframes float-fog-2 {
          0% { transform: translate(3%, 3%) scale(1.04); }
          50% { transform: translate(-3%, -3%) scale(1); }
          100% { transform: translate(3%, 3%) scale(1.04); }
        }
        .card-particle {
          animation: float-particle 8s linear infinite;
        }
        .group:hover .card-particle {
          animation-duration: 2.5s;
        }
      `}</style>

      {/* Spiderweb Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none" ref={bgWebRef}>
          <circle cx="500" cy="400" r="80" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="500" cy="400" r="160" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="500" cy="400" r="280" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5 5" />
          <circle cx="500" cy="400" r="420" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="500" cy="400" r="580" fill="none" stroke="white" strokeWidth="1.5" />
          
          <line x1="500" y1="400" x2="0" y2="0" stroke="white" strokeWidth="1.5" />
          <line x1="500" y1="400" x2="1000" y2="0" stroke="white" strokeWidth="1.5" />
          <line x1="500" y1="400" x2="1000" y2="800" stroke="white" strokeWidth="1.5" />
          <line x1="500" y1="400" x2="0" y2="800" stroke="white" strokeWidth="1.5" />
          <line x1="500" y1="400" x2="500" y2="0" stroke="white" strokeWidth="1.5" />
          <line x1="500" y1="400" x2="500" y2="800" stroke="white" strokeWidth="1.5" />
          <line x1="500" y1="400" x2="0" y2="400" stroke="white" strokeWidth="1.5" />
          <line x1="500" y1="400" x2="1000" y2="400" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Spiderweb image background pattern (layered depth overlay) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.07] pointer-events-none z-0 mix-blend-overlay"
        style={{ backgroundImage: `url(${spiderWebPathImage})` }}
      ></div>

      {/* Ambient Radial Lights (Red / Blue) */}
      <div 
        ref={fog1Ref}
        className="absolute -top-12 -left-16 w-[45vw] h-[40vh] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none z-0 animate-[float-fog-1_16s_ease-in-out_infinite]"
      />
      <div 
        ref={fog2Ref}
        className="absolute -bottom-12 -right-16 w-[45vw] h-[40vh] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0 animate-[float-fog-2_20s_ease-in-out_infinite]"
      />

      {/* Floating Spark Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 15 }).map((_, i) => {
          const delay = i * 1.3;
          const left = `${5 + Math.random() * 90}%`;
          const size = `${1.5 + Math.random() * 3}px`;
          const color = i % 2 === 0 ? 'bg-rose-500/50' : 'bg-blue-500/50';
          const duration = `${7 + Math.random() * 5}s`;
          const sway = `${-35 + Math.random() * 70}px`;

          return (
            <div
              key={i}
              className={`absolute bottom-0 rounded-full ${color} animate-[float-particle_${duration}_linear_infinite] opacity-40`}
              style={{
                left,
                width: size,
                height: size,
                animationDelay: `${delay}s`,
                '--sway-x': sway,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* 3D Animated Title Reveal */}
      <motion.div 
        className="flex flex-wrap items-center justify-center gap-x-4 mb-16 relative z-10"
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

      {/* Card Grid container */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 overflow-visible px-4 md:px-8 z-10 max-w-6xl mx-auto">
        


        {/* Phase 01 Card - MCQ Stage */}
        <div className="w-full flex" ref={card1Ref}>
          <MissionCard
            stage="MISSION 01"
            title="COGNITIVE & TECH SCREENING"
            icon={Cpu}
            color="#E11D48"
            themeColor="red"
            focusVectors="MCQ STAGE"
            cardRef={card1Ref}
          >
            <div className="space-y-4 w-full flex flex-col items-center">
              <span className="block font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                SYLLABUS MATRIX:
              </span>
              
              <motion.ul 
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {SYLLABUS_MATRIX.map(s => {
                  const syllabusIcons: Record<string, any> = {
                    web: Globe,
                    logic: Code2,
                    data: Database,
                    logical: Compass
                  };
                  const Icon = syllabusIcons[s.id] || Globe;
                  return (
                    <motion.li key={s.id} variants={itemVariants}>
                      <CodeChip 
                        icon={<Icon size={12} />}
                        className="hover:border-rose-500/50 hover:shadow-[0_0_12px_rgba(225,29,72,0.25)] hover:text-rose-200"
                      >
                        {s.label}
                      </CodeChip>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </MissionCard>
        </div>

        {/* Phase 02 Card - Coding Stage */}
        <div className="w-full flex" ref={card2Ref}>
          <MissionCard
            stage="MISSION 02"
            title="ALGORITHMIC CRUCIBLE"
            icon={Binary}
            color="#2563EB"
            themeColor="blue"
            focusVectors="CODING STAGE"
            cardRef={card2Ref}
          >
            <div className="space-y-4 w-full flex flex-col items-center">
              <span className="block font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                EXECUTION METRIC:
              </span>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex flex-col items-center w-full"
              >
                <motion.div variants={itemVariants}>
                  <CodeChip 
                    icon={<Network size={16} />} 
                    className="py-3 px-4 leading-relaxed hover:border-blue-500/50 hover:shadow-[0_0_12px_rgba(37,99,235,0.25)] hover:text-blue-200"
                  >
                   Data Structures & Algorithms (DSA)
                  </CodeChip>
                </motion.div>
              </motion.div>
            </div>
          </MissionCard>
        </div>

      </div>
    </section>
  );
};
