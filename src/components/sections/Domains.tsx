import { Globe, Database, Cpu, Binary, Compass, Network } from 'lucide-react';
import { Card } from '../Card';
import { motion } from 'framer-motion';
import webImage from '../../assets/images/web.png';
import webRope from '../../assets/images/web rope.png';

export const Domains = () => {
  return (
    <section id="domains" className="scroll-mt-24 space-y-12 pt-16 relative overflow-hidden">
      
      {/* Subtle background web image */}
      <div 
        className="absolute inset-0 bg-contain bg-center opacity-[0.06] pointer-events-none z-0 mix-blend-screen bg-repeat"
        style={{ backgroundImage: `url(${webImage})` }}
      ></div>

      <motion.div 
        className="space-y-2 text-center relative z-10"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-comic text-2xl md:text-4xl lg:text-5xl font-normal tracking-wide text-white uppercase">
          CHOOSE YOUR GUILD
        </h2>
        <p className="font-mono text-xs md:text-sm text-[#71717A] tracking-widest uppercase">
          Select a specialized domain for your technical journey
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 relative z-10">
        
        {/* Horizontal ceiling web rope rotated at 90 degrees */}
        <div className="absolute top-0 left-0 right-0 h-4 overflow-visible pointer-events-none select-none z-10 flex items-center justify-center">
          <img 
            src={webRope} 
            alt="Ceiling Web Rope" 
            className="rotate-90 w-4 h-[90vw] max-w-5xl object-fill opacity-85 filter brightness-125" 
          />
        </div>

        {/* Column 01: Frontend Dev & App Dev Chain */}
        <motion.div 
          className="flex flex-col items-center pt-16 relative select-none"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="animate-swing-slow-1 w-full hover:[animation-play-state:paused] flex flex-col items-center relative">
            
            {/* Top Rope */}
            <img 
              src={webRope} 
              alt="Web Rope" 
              className="absolute -top-[62px] left-1/2 -translate-x-1/2 w-4 h-16 object-fill pointer-events-none select-none z-20"
            />
            {/* Pulsing attachment node */}
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#E11D48] rounded-full border border-white z-30 animate-pulse shadow-[0_0_8px_#E11D48]"></div>
            
            <Card showHeader={false} className="space-y-4 border-t-4 border-t-[#E11D48] shadow-xl" shadowColor="#E11D48">
              <h3 className="font-comic text-lg text-white uppercase flex items-center gap-2">
                <Globe size={18} className="text-[#E11D48]" />
                Frontend Dev
              </h3>
              <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed">
                Craft cinematic web interfaces, user experiences, and micro-animations that amaze users at first glance.
              </p>
            </Card>

            {/* Connection rope to lower card */}
            <div className="w-full flex flex-col items-center pt-16 mt-3 relative">
              <img 
                src={webRope} 
                alt="Web Rope" 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 object-fill pointer-events-none select-none z-20"
              />
              {/* Top knot under upper card */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#E11D48] rounded-full border border-white z-30 animate-pulse"></div>
              {/* Bottom knot on lower card */}
              <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#38BDF8] rounded-full border border-white z-30 animate-pulse shadow-[0_0_8px_#38BDF8]"></div>
              
              <Card showHeader={false} className="space-y-4 border-t-4 border-t-[#38BDF8] shadow-xl" shadowColor="#38BDF8">
                <h3 className="font-comic text-lg text-white uppercase flex items-center gap-2">
                  <Binary size={18} className="text-[#38BDF8]" />
                  App Development
                </h3>
                <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed">
                  Design and build responsive mobile apps that put the power of the spider network straight into pockets.
                </p>
              </Card>
            </div>

          </div>
        </motion.div>

        {/* Column 02: Backend Dev & UI/UX Designing Chain */}
        <motion.div 
          className="flex flex-col items-center pt-16 relative select-none"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <div className="animate-swing-slow-2 w-full hover:[animation-play-state:paused] flex flex-col items-center relative">
            
            {/* Top Rope */}
            <img 
              src={webRope} 
              alt="Web Rope" 
              className="absolute -top-[62px] left-1/2 -translate-x-1/2 w-4 h-16 object-fill pointer-events-none select-none z-20"
            />
            {/* Pulsing attachment node */}
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#2563EB] rounded-full border border-white z-30 animate-pulse shadow-[0_0_8px_#2563EB]"></div>
            
            <Card showHeader={false} className="space-y-4 border-t-4 border-t-[#2563EB] shadow-xl" shadowColor="#2563EB">
              <h3 className="font-comic text-lg text-white uppercase flex items-center gap-2">
                <Database size={18} className="text-[#2563EB]" />
                Backend Dev
              </h3>
              <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed">
                Build bulletproof logic engines, APIs, and scalable database servers to keep the entire network online.
              </p>
            </Card>

            {/* Connection rope to lower card */}
            <div className="w-full flex flex-col items-center pt-16 mt-3 relative">
              <img 
                src={webRope} 
                alt="Web Rope" 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 object-fill pointer-events-none select-none z-20"
              />
              {/* Top knot under upper card */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#2563EB] rounded-full border border-white z-30 animate-pulse"></div>
              {/* Bottom knot on lower card */}
              <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#FACC15] rounded-full border border-white z-30 animate-pulse shadow-[0_0_8px_#FACC15]"></div>
              
              <Card showHeader={false} className="space-y-4 border-t-4 border-t-[#FACC15] shadow-xl" shadowColor="#FACC15">
                <h3 className="font-comic text-lg text-white uppercase flex items-center gap-2">
                  <Compass size={18} className="text-[#FACC15]" />
                  UI/UX Designing
                </h3>
                <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed">
                  Illustrate branding guidelines, design comic layouts, frame interfaces, and shape the visual multiverse.
                </p>
              </Card>
            </div>

          </div>
        </motion.div>

        {/* Column 03: AI & Machine Learning & Managerial Chain */}
        <motion.div 
          className="flex flex-col items-center pt-16 relative select-none"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="animate-swing-slow-3 w-full hover:[animation-play-state:paused] flex flex-col items-center relative">
            
            {/* Top Rope */}
            <img 
              src={webRope} 
              alt="Web Rope" 
              className="absolute -top-[62px] left-1/2 -translate-x-1/2 w-4 h-16 object-fill pointer-events-none select-none z-20"
            />
            {/* Pulsing attachment node */}
            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#7C3AED] rounded-full border border-white z-30 animate-pulse shadow-[0_0_8px_#7C3AED]"></div>
            
            <Card showHeader={false} className="space-y-4 border-t-4 border-t-[#7C3AED] shadow-xl" shadowColor="#7C3AED">
              <h3 className="font-comic text-lg text-white uppercase flex items-center gap-2">
                <Cpu size={18} className="text-[#7C3AED]" />
                AI & Machine Learning
              </h3>
              <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed">
                Deploy deep learning models, computer vision systems, and neural nodes that power smart automation.
              </p>
            </Card>

            {/* Connection rope to lower card */}
            <div className="w-full flex flex-col items-center pt-16 mt-3 relative">
              <img 
                src={webRope} 
                alt="Web Rope" 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 object-fill pointer-events-none select-none z-20"
              />
              {/* Top knot under upper card */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#7C3AED] rounded-full border border-white z-30 animate-pulse"></div>
              {/* Bottom knot on lower card */}
              <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#10B981] rounded-full border border-white z-30 animate-pulse shadow-[0_0_8px_#10B981]"></div>
              
              <Card showHeader={false} className="space-y-4 border-t-4 border-t-emerald-500 shadow-xl" shadowColor="#10B981">
                <h3 className="font-comic text-lg text-white uppercase flex items-center gap-2">
                  <Network size={18} className="text-emerald-500" />
                  Managerial & PR
                </h3>
                <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed">
                  Lead operations, coordinate hackathons, handle public relations, and maintain organizational synergy.
                </p>
              </Card>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
