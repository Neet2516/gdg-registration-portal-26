import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqs } from './types';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section 
      className="relative w-full bg-[#1B1F27] pt-16 pb-28 md:pt-24 md:pb-36 text-white overflow-hidden" 
      id="faq"
    >
      <div className="relative z-10 mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Section Heading & Solid White Underline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 sm:mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-black uppercase tracking-tight text-white m-0 leading-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          {/* Thin, white horizontal divider directly below the heading */}
          <div className="w-full h-[2px] bg-white mt-4 sm:mt-5" />
        </motion.div>

        {/* Stacked Paper FAQ Accordion List */}
        <div className="space-y-6 sm:space-y-8">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={`${faq.question}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="relative group transition-all"
              >
                {/* Stacked Paper Effect: Subtle off-white backing layer */}
                <div 
                  className="absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-3.5 sm:translate-y-3.5 bg-[#FAF8F5] border-2 border-[#1c242b] shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-transform group-hover:translate-x-4 group-hover:translate-y-4 pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Main Dark Front Card with Crisp White Border */}
                <div 
                  className="relative bg-[#1B1F27] border-2 border-white transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 sm:p-6 md:p-7 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
                    aria-expanded={isOpen}
                  >
                    {/* Badge and Question */}
                    <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-wrap sm:flex-nowrap">
                      <span className="inline-flex items-center justify-center px-2 sm:px-2.5 py-0.5 border border-white rounded-[3px] font-mono text-xs sm:text-sm font-bold text-white tracking-wider shrink-0 select-none">
                        {faq.badge || '01'}
                      </span>
                      <span className="font-mono text-base sm:text-lg md:text-xl font-bold tracking-tight text-white">
                        {faq.question}
                      </span>
                    </div>

                    {/* Bold Coral / Red-Orange Plus/Minus Toggle */}
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 select-none" aria-hidden="true">
                      {isOpen ? (
                        <svg 
                          className="w-5 h-5 sm:w-6 sm:h-6 text-[#de432c]" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          strokeLinecap="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      ) : (
                        <svg 
                          className="w-5 h-5 sm:w-6 sm:h-6 text-[#de432c]" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {/* Expanded Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pt-0 sm:px-6 sm:pb-7 md:px-7 md:pb-8">
                          <p className="font-mono text-xs sm:text-sm md:text-[0.95rem] text-gray-200/90 font-normal leading-relaxed m-0">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
