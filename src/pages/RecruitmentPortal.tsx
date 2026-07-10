import { CaptchaGate } from '../components/CaptchaGate';
import { RegistrationForm } from '../components/RegistrationForm';
import { OtpVerification } from '../components/OtpVerification';
import { SuccessScreen } from '../components/SuccessScreen';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CodeChip } from '../components/CodeChip';
import { FlowProgress } from '../components/FlowProgress';
import { Footer } from '../components/Footer';
import { SYLLABUS_MATRIX } from '../constants/recruitment';
import { usePortalContext } from '../context/PortalContext';
import { 
  Terminal, 
  Cpu, 
  Code2, 
  Database, 
  Globe, 
  Binary, 
  Network, 
  Compass, 
  ArrowDown, 
  Sparkles 
} from 'lucide-react';

export const RecruitmentPortal = () => {
  const { currentState, setCurrentState, formData, setFormData } = usePortalContext();

  const handleCaptchaSuccess = () => {
    setCurrentState('REGISTRATION_FORM');
  };

  const handleRegistrationSuccess = (data: any) => {
    setFormData(data);
    setCurrentState('OTP_VERIFICATION');
  };

  const handleOtpSuccess = () => {
    setCurrentState('SUCCESS_SCREEN');
  };

  const handleOtpBack = () => {
    setCurrentState('REGISTRATION_FORM');
  };

  return (
    <div className="w-full bg-[#000000] min-h-screen text-white font-sans selection:bg-white selection:text-black overflow-x-hidden relative">
      {/* Absolute background patterns */}
      <div className="absolute inset-0 dither-bg opacity-15 pointer-events-none z-0"></div>
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none z-0"></div>

      {/* Retro CRT edge curvature overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-50"></div>

      {/* Global Navigation Header */}
      <header className="border-b border-[#71717A]/30 bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black p-1">
              <Terminal size={18} />
            </div>
            <div className="font-mono text-xs md:text-sm font-bold tracking-widest uppercase text-white">
              GDG AKGEC // PROXIMITY 6.0
            </div>
          </div>
          <div className="font-mono text-[9px] md:text-xs text-zinc-500 tracking-wider hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-green-500 animate-ping"></span>
            <span>SYSTEM STATE: OPERATION_ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-24 relative z-10">
        
        {/* Section 01: Hero Portal Terminal */}
        <section className="space-y-8 pt-6 animate-pulse-slow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Left Sub-Header Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#71717A]/30 bg-[#0D0E12]/80">
                <Sparkles size={12} className="text-white animate-pulse" />
                <span className="font-mono text-[10px] md:text-xs text-white tracking-widest uppercase">
                  "FROM PIXELS TO PROGRAMS. BUILD WHAT MATTERS."
                </span>
              </div>

              {/* Primary Title Display */}
              <div className="space-y-2">
                <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-widest text-white uppercase terminal-glow">
                  PROXIMITY 6.0
                </h1>
                <p className="font-mono text-lg md:text-xl text-[#71717A] tracking-wider uppercase">
                  GDG AKGEC RECRUITMENT PORTAL
                </p>
              </div>

              {/* Introductory Context Block */}
              <div className="border-l-2 border-white pl-6 space-y-4 font-sans text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
                <p>
                  Turn ideas into impactful experiences through design and engineering. Join a community of creators, innovators, and problem-solvers shaping the future—one interface, one algorithm, and one product at a time.
                </p>
                <p className="font-mono text-xs text-[#71717A]">
                  Proximity 6.0 is your gateway into Google Developer Groups AKGEC. This portal serves as your official entry point to register for the multi-tiered recruitment crucible designed to evaluate your fundamental tech metrics, structural instincts, and algorithmic problem-solving capabilities.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <a href="#registration-terminal">
                  <Button
                    variant="primary"
                    icon={<ArrowDown size={14} />}
                    className="py-3 px-6"
                  >
                    Initialize Connection
                  </Button>
                </a>
              </div>
            </div>

            {/* Visual Retro Box Container (Dither/Halftone Simulation) */}
            <div className="lg:col-span-4 hidden lg:block">
              <Card
                title="SYSTEM_DIAGNOSTICS"
                titleIcon={<Terminal size={14} className="text-zinc-500 animate-pulse" />}
                headerExtra={<span className="text-[9px] text-zinc-500 font-mono">ID: GDG-6.0</span>}
              >
                <div className="h-64 flex flex-col justify-between font-mono text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">MEM_ALLOC:</span>
                      <span>100% OK</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">CORE_VOLT:</span>
                      <span>1.18V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">NETWORK:</span>
                      <span>STABLE</span>
                    </div>
                  </div>

                  {/* Simulated orbit tracks using brutalist vectors */}
                  <div className="h-32 border border-[#71717A]/30 relative flex items-center justify-center bg-black overflow-hidden group">
                    <div className="absolute w-24 h-24 border border-dashed border-[#71717A]/40 rounded-full animate-[spin_20s_linear_infinite]"></div>
                    <div className="absolute w-16 h-16 border border-zinc-800 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                    <div className="absolute w-2 h-2 bg-white"></div>
                    <div className="absolute bottom-2 left-2 text-[8px] text-zinc-600">ORBITAL_ENGINE</div>
                  </div>

                  <div className="text-[10px] text-zinc-500 text-center animate-pulse">
                    &gt; READY TO RECEIVE INCOMING PACKETS
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 02: Recruitment Evaluation Path */}
        <section className="space-y-8 border-t border-[#71717A]/20 pt-16">
          <div className="space-y-2">
            <h2 className="font-mono text-xl md:text-2xl font-bold tracking-widest text-white uppercase">
              RECRUITMENT EVALUATION PATH
            </h2>
            <p className="font-mono text-xs text-[#71717A] tracking-wider uppercase">
              Operational metrics for candidate appraisal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Phase 01 Card */}
            <Card
              showHeader={false}
              className="space-y-6 relative group hover:border-white transition-snap"
            >
              <div className="absolute top-6 right-6 bg-white text-black py-1 px-2 font-mono text-[9px] font-bold tracking-wider uppercase">
                MCQ STAGE
              </div>
              <div className="space-y-2 text-left">
                <span className="font-mono text-xs text-[#71717A] tracking-widest uppercase block">
                  STAGE 01
                </span>
                <h3 className="font-mono text-lg font-bold tracking-widest text-white uppercase flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <Cpu size={18} />
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
              className="space-y-6 relative group hover:border-white transition-snap"
            >
              <div className="absolute top-6 right-6 bg-white text-black py-1 px-2 font-mono text-[9px] font-bold tracking-wider uppercase">
                CODING STAGE
              </div>
              <div className="space-y-2 text-left">
                <span className="font-mono text-xs text-[#71717A] tracking-widest uppercase block">
                  STAGE 02
                </span>
                <h3 className="font-mono text-lg font-bold tracking-widest text-white uppercase flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <Binary size={18} />
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

        {/* Section 03: Direct Registration Terminal (The Form) */}
        <section id="registration-terminal" className="space-y-8 border-t border-[#71717A]/20 pt-16 pb-16 flex flex-col items-center">
          <div className="text-center space-y-2">
            <h2 className="font-mono text-xl md:text-2xl font-bold tracking-widest text-white uppercase">
              REGISTRATION GATEWAY
            </h2>
            <FlowProgress currentStep={currentState} className="mt-4" />
          </div>

          <div className="w-full flex justify-center mt-6">
            {currentState === 'CAPTCHA_GATE' && (
              <CaptchaGate onSuccess={handleCaptchaSuccess} />
            )}

            {currentState === 'REGISTRATION_FORM' && (
              <RegistrationForm onSuccess={handleRegistrationSuccess} />
            )}

            {currentState === 'OTP_VERIFICATION' && (
              <OtpVerification 
                email={formData?.email || ''} 
                formData={formData}
                onSuccess={handleOtpSuccess} 
                onBack={handleOtpBack}
              />
            )}

            {currentState === 'SUCCESS_SCREEN' && (
              <SuccessScreen formData={formData} />
            )}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};
