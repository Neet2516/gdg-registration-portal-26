import { Button } from '../Button';
import { motion } from 'framer-motion';
import spidermanHanging from '../../assets/images/spiderman hanging.png';

export const Hero = () => {
  return (
    <section id="hero" className="pt-16 pb-12 relative flex flex-col items-center justify-center text-center overflow-visible">

      {/* Hanging Spider-Man from top right - slides down and sways */}
      <motion.img 
        src={spidermanHanging} 
        alt="Spider-Man Hanging" 
        className="absolute -top-20 right-2 sm:right-4 md:right-16 w-16 sm:w-24 md:w-36 pointer-events-none select-none z-20 animate-swing-slow-2"
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 40, delay: 0.6 }}
      />
      
      {/* Glowing curved portal backdrop (elliptical curve glow) */}
      <div className="absolute w-[80vw] max-w-[700px] h-[300px] rounded-[50%] bg-gradient-to-r from-[#E11D48]/20 via-[#7C3AED]/20 to-[#2563EB]/20 blur-[90px] pointer-events-none z-0 select-none"></div>
      
      <div className="max-w-5xl space-y-10 relative z-10 flex flex-col items-center">
        {/* Primary Title Display */}
        <div className="space-y-4">
          <motion.h1 
            className="title-spiderman text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-none select-none"
            initial={{ scale: 0.7, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
          >
            PROXIMITY 6.0
          </motion.h1>
          
          <motion.p 
            className="subtitle-spiderman text-[10px] sm:text-xs md:text-sm lg:text-2xl text-zinc-200 font-light select-none tracking-[0.2em] sm:tracking-[0.35em]"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            GDG AKGEC RECRUITMENT PORTAL
          </motion.p>
        </div>

        <motion.div 
          className="flex items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <a href="#registration-terminal">
            <Button
              variant="outline"
              className="py-3 sm:py-4 px-6 sm:px-10 text-base md:text-lg tracking-widest border-0 hover:bg-white/5 hover:border-[#E11D48] hover:text-[#E11D48] transition-all duration-300"
            >
              <span className="text-xl sm:text-2xl md:text-3xl">Initialize Connection</span>
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
