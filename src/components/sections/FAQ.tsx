export const FAQ = () => {
  return (
    <section id="faq" className="scroll-mt-24 space-y-8 pt-16 relative overflow-hidden">
      <div className="space-y-2">
        <h2 className="font-comic text-2xl md:text-4xl lg:text-5xl font-normal tracking-wide text-white uppercase">
          SPEECH BUBBLE INTEL (FAQ)
        </h2>
        <p className="font-mono text-xs md:text-sm text-[#71717A] tracking-widest uppercase">
          Answers to frequently asked questions about recruitment
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2 text-left">
          <div className="inline-block bg-[#E11D48]/10 border border-[#E11D48] text-white px-4 py-2 font-comic rounded-lg relative">
            Q: Who can register for Proximity 6.0?
          </div>
          <div className="ml-6 p-4 bg-zinc-900 border border-zinc-700 text-zinc-300 font-sans text-sm md:text-base rounded-xl relative shadow-md">
            A: Any 1st-year student at AKGEC who is passionate about coding, development, designing, AI/ML, or management is welcome to register! No prior coding experience is required.
            <div className="absolute -top-[7px] left-4 w-3.5 h-3.5 bg-zinc-900 border-l border-t border-zinc-700 rotate-45"></div>
          </div>
        </div>

        <div className="space-y-2 text-left pt-2">
          <div className="inline-block bg-[#2563EB]/10 border border-[#2563EB] text-white px-4 py-2 font-comic rounded-lg relative">
            Q: What are the phases of the recruitment process?
          </div>
          <div className="ml-6 p-4 bg-zinc-900 border border-zinc-700 text-zinc-300 font-sans text-sm md:text-base rounded-xl relative shadow-md">
            A: Phase 01 consists of MCQ screening (analytical, reasoning, and domain basics). Phase 02 consists of a sandboxed competitive coding challenge (DSA/problem solving) or design challenges depending on your domain.
            <div className="absolute -top-[7px] left-4 w-3.5 h-3.5 bg-zinc-900 border-l border-t border-zinc-700 rotate-45"></div>
          </div>
        </div>

        <div className="space-y-2 text-left pt-2">
          <div className="inline-block bg-[#7C3AED]/10 border border-[#7C3AED] text-white px-4 py-2 font-comic rounded-lg relative">
            Q: Can I apply for more than one domain?
          </div>
          <div className="ml-6 p-4 bg-zinc-900 border border-zinc-700 text-zinc-300 font-sans text-sm md:text-base rounded-xl relative shadow-md">
            A: You must select one primary domain in the registration form which will dictate your Phase 1 and Phase 2 evaluation track. Choose the domain you are most passionate about!
            <div className="absolute -top-[7px] left-4 w-3.5 h-3.5 bg-zinc-900 border-l border-t border-zinc-700 rotate-45"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
