import { Cpu, Binary, Globe, Code2, Database, Compass, Network } from 'lucide-react';
import { Card } from '../Card';
import { CodeChip } from '../CodeChip';
import { SYLLABUS_MATRIX } from '../../constants/recruitment';
import spiderWebPathImage from '../../assets/images/spider web image.jpg';

export const EvaluationPath = () => {
  return (
    <section id="evaluation-path" className="scroll-mt-24 space-y-8 pt-16 relative overflow-hidden">
      
      {/* Spiderweb background pattern for recruitment evaluation path */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none z-0 mix-blend-overlay"
        style={{ backgroundImage: `url(${spiderWebPathImage})` }}
      ></div>
      <div className="space-y-2">
        <h2 className="font-comic text-2xl md:text-4xl lg:text-5xl font-normal tracking-wide text-white uppercase">
          RECRUITMENT EVALUATION PATH
        </h2>
        <p className="font-mono text-xs md:text-sm text-[#71717A] tracking-widest uppercase">
          Operational metrics for candidate appraisal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Phase 01 Card */}
        <Card
          showHeader={false}
          className="space-y-6"
          shadowColor="#E11D48"
        >
          <div className="absolute top-6 right-6 bg-[#E11D48] text-white py-1.5 px-3 font-comic text-[10px] tracking-wider uppercase rounded-sm border border-white/20 shadow-md">
            MCQ STAGE
          </div>
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-[#E11D48] font-bold tracking-widest uppercase block">
              STAGE 01
            </span>
            <h3 className="font-comic text-lg md:text-2xl font-normal tracking-wide text-white uppercase flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Cpu size={20} className="text-[#E11D48]" />
              PHASE 01 | COGNITIVE & TECH SCREENING
            </h3>
          </div>

          <div className="space-y-4 font-sans text-sm text-zinc-400 text-left">
            <p>
              <strong>Focus Vectors:</strong> Technical foundations and baseline analytical capability.
            </p>
            <div className="border-t border-[#71717A]/20 pt-4 space-y-3">
              <span className="block font-mono text-[10px] text-white tracking-widest uppercase">
                SYLLABUS MATRIX:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYLLABUS_MATRIX.map(s => {
                  const syllabusIcons: Record<string, any> = {
                    web: Globe,
                    logic: Code2,
                    data: Database,
                    logical: Compass
                  };
                  const Icon = syllabusIcons[s.id] || Globe;
                  return (
                    <li key={s.id}>
                      <CodeChip icon={<Icon size={12} />}>
                        {s.label}
                      </CodeChip>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Card>

        {/* Phase 02 Card */}
        <Card
          showHeader={false}
          className="space-y-6"
          shadowColor="#2563EB"
        >
          <div className="absolute top-6 right-6 bg-[#2563EB] text-white py-1.5 px-3 font-comic text-[10px] tracking-wider uppercase rounded-sm border border-white/20 shadow-md">
            CODING STAGE
          </div>
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-[#2563EB] font-bold tracking-widest uppercase block">
              STAGE 02
            </span>
            <h3 className="font-comic text-lg md:text-2xl font-normal tracking-wide text-white uppercase flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Binary size={20} className="text-[#2563EB]" />
              PHASE 02 | ALGORITHMIC CRUCIBLE
            </h3>
          </div>

          <div className="space-y-4 font-sans text-sm text-zinc-400 text-left">
            <p>
              <strong>Focus Vectors:</strong> Computational problem solving and code optimization.
            </p>
            <div className="border-t border-[#71717A]/20 pt-4 space-y-3">
              <span className="block font-mono text-[10px] text-white tracking-widest uppercase">
                EXECUTION METRIC:
              </span>
              <CodeChip icon={<Network size={16} />} className="py-3 px-4">
                Sandboxed competitive programming stage featuring standard multi-level Data Structures & Algorithms (DSA) problems.
              </CodeChip>
            </div>
          </div>
        </Card>

      </div>
    </section>
  );
};
