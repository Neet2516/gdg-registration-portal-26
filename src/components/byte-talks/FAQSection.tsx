import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { faqs } from './types';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative w-full bg-[#1B1F27] py-16 md:py-24 text-white" id="faq">
      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <span className="badge-3d-red px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white">
            04 / GOOD TO KNOW
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black text-white">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </motion.div>

        {/* Accordion List with AnimatePresence */}
        <div className="space-y-4 max-w-4xl">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="border-2 border-white/20 bg-[#161c24] shadow-[5px_5px_0_#000000] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 font-mono text-[0.88rem] md:text-[0.98rem] font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[0.75rem] font-bold text-[#de432c]">
                      0{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`shrink-0 text-[#de432c] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-1 font-mono text-[0.82rem] leading-relaxed text-white/80 border-t border-white/10">
                        <p className="m-0 pl-8">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10">
          <motion.a
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ x: 2, y: 2 }}
            href="#register"
            className="btn-3d-red inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[0.82rem] font-bold uppercase tracking-wider no-underline cursor-pointer"
          >
            <span>HAVE A QUESTION? REGISTER YOUR INTEREST</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
