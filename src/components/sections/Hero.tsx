import { Button } from '../Button';
import { motion } from 'framer-motion';
import spidermanHanging from '../../assets/images/spiderman hanging.png';
import proximityImg from '../../assets/images/PROXIMITY.png';

export const Hero = () => {
  return (
    <section id="hero" className="pt-24 pb-16 relative flex flex-col items-center justify-center text-center overflow-visible min-h-[75vh]">

      {/* Hanging Spider-Man from top right - slides down and sways */}
      <motion.img 
        src={spidermanHanging} 
        alt="Spider-Man Hanging" 
        className="absolute -top-24 right-2 sm:right-4 md:right-16 w-16 sm:w-24 md:w-36 pointer-events-none select-none z-20 animate-swing-slow-2"
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 40, delay: 0.6 }}
      />
      
      {/* Glowing curved portal backdrop (elliptical curve glow) */}
      <div className="absolute w-[80vw] max-w-[700px] h-[320px] rounded-[50%] bg-gradient-to-r from-[#E11D48]/20 via-[#7C3AED]/20 to-[#2563EB]/20 blur-[90px] pointer-events-none z-0 select-none"></div>
      
      <div className="max-w-5xl space-y-8 relative z-10 flex flex-col items-center">
        {/* Primary Title Display */}
        <div className="space-y-6 flex flex-col items-center">
          <motion.img 
            src={proximityImg}
            alt="PROXIMITY" 
            className="w-[95vw] max-w-[840px] h-auto object-contain mx-auto select-none pointer-events-none drop-shadow-[0_0_35px_rgba(225,29,72,0.6)]"
            initial={{ scale: 0.7, opacity: 0, rotate: -2 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
          />
          
          <motion.p 
            className="subtitle-spiderman text-[10px] sm:text-xs md:text-sm lg:text-lg text-zinc-300 font-light select-none tracking-[0.2em] sm:tracking-[0.35em] mt-3"
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
