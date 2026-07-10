import { Shield, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface FlowProgressProps {
  currentStep: 'CAPTCHA_GATE' | 'REGISTRATION_FORM' | 'OTP_VERIFICATION' | 'SUCCESS_SCREEN';
  className?: string;
}

export const FlowProgress: React.FC<FlowProgressProps> = ({
  currentStep,
  className = ''
}) => {
  const steps = [
    { key: 'CAPTCHA_GATE', label: '1. ANTIBOT', icon: Shield },
    { key: 'REGISTRATION_FORM', label: '2. REPO INGESTION', icon: FileText },
    { key: 'OTP_VERIFICATION', label: '3. VERIFY ID', icon: Lock },
    { key: 'SUCCESS_SCREEN', label: '4. ACTIVE ENTRY', icon: CheckCircle2 }
  ] as const;

  const currentIdx = steps.findIndex(s => s.key === currentStep);

  return (
    <div className={`w-full max-w-2xl font-mono text-[10px] tracking-wider uppercase border border-[#71717A]/40 bg-zinc-950 p-4 relative overflow-hidden select-none ${className}`}>
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 dither-bg opacity-5 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.key === currentStep;
          const isCompleted = idx < currentIdx;

          let statusColor = 'text-zinc-600 border-zinc-800 bg-transparent';
          if (isActive) {
            statusColor = 'text-white border-white bg-white/5 font-bold underline';
          } else if (isCompleted) {
            statusColor = 'text-green-500 border-green-800 bg-green-950/15';
          }

          return (
            <div
              key={step.key}
              className={`flex-1 flex items-center gap-2.5 border p-2.5 transition-snap ${statusColor}`}
            >
              <Icon size={12} className={isActive ? 'animate-pulse' : ''} />
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
