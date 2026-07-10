import { CheckCircle2, Mail, Calendar } from 'lucide-react';
import type { RegistrationData } from './RegistrationForm';
import { Card } from './Card';
import { CodeChip } from './CodeChip';

interface SuccessScreenProps {
  formData: RegistrationData | null;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ formData }) => {
  const regTimestamp = new Date().toLocaleString();
  const applicationHash = `PROX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${formData?.studentNumber || '0000000'}`;

  return (
    <Card showHeader={false} className="max-w-xl">
      <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 mb-6"></div>

      {/* Verification Badge */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 border border-green-500/40 text-green-500 animate-pulse">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-1">
          <h1 className="font-mono text-base md:text-lg text-white font-bold tracking-widest uppercase">
            REGISTRATION SECURED // APPLICATION STATE: ACTIVE
          </h1>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            TRANSMISSION RECORD ID: <span className="text-white select-all">{applicationHash}</span>
          </p>
        </div>
      </div>

      {/* Applicant Card/Receipt detail block */}
      <div className="bg-black border border-[#71717A]/40 p-5 font-mono text-xs text-white space-y-4 relative mb-6">
        <div className="absolute top-0 right-0 p-2 bg-[#71717A]/10 border-l border-b border-[#71717A]/40 text-[9px] uppercase tracking-widest text-[#71717A]">
          Official Entry pass
        </div>
        
        <h2 className="text-[#71717A] text-[10px] tracking-widest uppercase border-b border-[#71717A]/20 pb-2">
          CRUCIBLE CANDIDATE FILE
        </h2>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">APPLICANT</span>
            <span className="text-white font-bold uppercase">{formData?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">STUDENT ID</span>
            <span className="text-white font-bold">{formData?.studentNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">SELECTION BRANCH</span>
            <span className="text-white font-bold">{formData?.branch || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">RESIDENCY</span>
            <span className="text-white font-bold uppercase">{formData?.residence || 'N/A'}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">INSTITUTIONAL EMAIL</span>
            <span className="text-white font-bold select-all">{formData?.email || 'N/A'}</span>
          </div>
        </div>

        <div className="border-t border-[#71717A]/20 pt-3 text-[10px] text-zinc-500 flex justify-between items-center">
          <span>COMPILED ON: {regTimestamp}</span>
          <span className="text-green-500 font-bold">VERIFIED_SECURE</span>
        </div>
      </div>

      {/* Cosmic Sign Off block */}
      <div className="space-y-4 font-sans text-sm text-[#71717A] border-t border-[#71717A]/20 pt-6 text-left">
        <p className="leading-relaxed font-sans text-white/90">
          Welcome to the crucible. Keep monitoring your institutional mail inbox for Phase 01 MCQ entry coordinates.
        </p>
        <p className="text-xs leading-relaxed font-mono text-[#71717A]">
          Your credentials have been successfully written to the secure recruitment datastore. You are now queued to undergo evaluation. Maintain operational readiness.
        </p>
      </div>

      {/* Action footer */}
      <div className="mt-8 pt-4 border-t border-[#71717A]/20 flex flex-col sm:flex-row gap-3">
        <CodeChip icon={<Mail size={16} />} className="flex-1 p-3">
          <span className="text-[9px] tracking-wider text-zinc-500 uppercase block">EMAIL SENT TO:</span>
          <span className="text-white font-bold text-[10px] block">{formData?.email || 'N/A'}</span>
        </CodeChip>
        
        <CodeChip icon={<Calendar size={16} />} className="flex-1 p-3">
          <span className="text-[9px] tracking-wider text-zinc-500 uppercase block">PHASE 1 MCQ SCREENING:</span>
          <span className="text-white font-bold text-[10px] block">TBA (CHECK MAIL)</span>
        </CodeChip>
      </div>
    </Card>
  );
};
