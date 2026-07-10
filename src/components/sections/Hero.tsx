import { ArrowDown } from 'lucide-react';
import { Button } from '../Button';
import spidermanHanging from '../../assets/images/spiderman hanging.png';

export const Hero = () => {
  return (
    <section id="hero" className="pt-16 pb-12 relative flex flex-col items-center justify-center text-center overflow-visible">

      {/* Hanging Spider-Man from top right */}
      <img 
        src={spidermanHanging} 
        alt="Spider-Man Hanging" 
        className="absolute -top-24 right-4 md:right-16 w-24 md:w-36 pointer-events-none select-none z-20 animate-swing-slow-2"
      />
      
      {/* Glowing curved portal backdrop (elliptical curve glow) */}
      <div className="absolute w-[80vw] max-w-[700px] h-[300px] rounded-[50%] bg-gradient-to-r from-[#E11D48]/20 via-[#7C3AED]/20 to-[#2563EB]/20 blur-[90px] pointer-events-none z-0 select-none"></div>
      
      <div className="max-w-5xl space-y-10 relative z-10 flex flex-col items-center">
        {/* Primary Title Display */}
        <div className="space-y-4">
          <h1 className="title-spiderman text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-none select-none">
            PROXIMITY 6.0
          </h1>
          <p className="subtitle-spiderman text-sm md:text-base lg:text-3xl text-zinc-200 font-light select-none tracking-[0.35em]">
            GDG AKGEC RECRUITMENT PORTAL
          </p>
        </div>

        <div className="flex items-center justify-center">
          <a href="#registration-terminal">
            <Button
              variant="outline"
              icon={<ArrowDown size={40} className="animate-bounce text-[#E11D48]" />}
              className=" py-4 px-10 text-base md:text-lg tracking-widest border-0 hover:bg-white/5 hover:border-[#E11D48] hover:text-[#E11D48] transition-all duration-300"
            >
              <span className='text-3xl'>Initialize Connection</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
