import { motion } from 'framer-motion';

export const FAQ = () => {
  return (
    <section id="faq" className="scroll-mt-24 space-y-8 pt-16 relative overflow-hidden">
      
      <motion.div 
        className="space-y-2 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="title-spiderman text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase select-none tracking-tight text-shadow-glow" >
          SPEECH BUBBLE INTEL (FAQ)
        </h2>
        
      </motion.div>

      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Q1 */}
        <div className="space-y-2 text-left">
          <motion.div 
            className="inline-block bg-[#E11D48]/10 border border-[#E11D48] text-white px-4 py-2 font-oswald text-base md:text-lg rounded-lg relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            Q: Who can register for Proximity 6.0?
          </motion.div>
          <motion.div 
            className="ml-3 sm:ml-6 p-4 bg-zinc-900 border border-zinc-700 text-zinc-300 font-sans text-base md:text-lg rounded-xl relative shadow-md"
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.15 }}
          >
            A: Any 2ND-year student at AKGEC who is passionate about coding, development, designing, AI/ML, or management is welcome to register! No prior coding experience is required.
            <div className="absolute -top-[7px] left-4 w-3.5 h-3.5 bg-zinc-900 border-l border-t border-zinc-700 rotate-45"></div>
          </motion.div>
        </div>

        {/* Q2 */}
        <div className="space-y-2 text-left pt-2">
          <motion.div 
            className="inline-block bg-[#2563EB]/10 border border-[#2563EB] text-white px-4 py-2 font-oswald text-base md:text-lg rounded-lg relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            Q: What are the phases of the recruitment process?
          </motion.div>
          <motion.div 
            className="ml-3 sm:ml-6 p-4 bg-zinc-900 border border-zinc-700 text-zinc-300 font-sans text-base md:text-lg rounded-xl relative shadow-md"
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.15 }}
          >
            A: Phase 01 consists of MCQ screening (analytical, reasoning, and domain basics). Phase 02 consists of a sandboxed competitive coding challenge (DSA/problem solving) or design challenges depending on your domain.
            <div className="absolute -top-[7px] left-4 w-3.5 h-3.5 bg-zinc-900 border-l border-t border-zinc-700 rotate-45"></div>
          </motion.div>
        </div>

        {/* Q3 */}
        <div className="space-y-2 text-left pt-2">
          <motion.div 
            className="inline-block bg-[#7C3AED]/10 border border-[#7C3AED] text-white px-4 py-2 font-oswald text-base md:text-lg rounded-lg relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            Q: Can I apply for more than one domain?
          </motion.div>
          <motion.div 
            className="ml-3 sm:ml-6 p-4 bg-zinc-900 border border-zinc-700 text-zinc-300 font-sans text-base md:text-lg rounded-xl relative shadow-md"
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.15 }}
          >
            A: You must select one primary domain in the registration form which will dictate your Phase 1 and Phase 2 evaluation track. Choose the domain you are most passionate about!
            <div className="absolute -top-[7px] left-4 w-3.5 h-3.5 bg-zinc-900 border-l border-t border-zinc-700 rotate-45"></div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
