import { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, Terminal } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface CaptchaGateProps {
  onSuccess: () => void;
}

export const CaptchaGate: React.FC<CaptchaGateProps> = ({ onSuccess }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 12) + 4;
    const n2 = Math.floor(Math.random() * 12) + 2;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setError(null);
  };

  useEffect(() => {
    generateCaptcha();
    setTerminalLogs([
      'SYSTEM INITIALIZATION: SECURE CONNECTION DETECTED...',
      'ENCRYPTING LOCAL ENDPOINTS...',
      'CRITICAL AUTHENTICATION GATEWAY LOADED.',
      'AWAITING HUMAN METRICS EVALUATION...'
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = num1 + num2;
    const parsedAnswer = parseInt(userAnswer.trim(), 10);

    if (isNaN(parsedAnswer)) {
      setError('ERROR: VALUE MUST BE AN INTEGER.');
      setTerminalLogs(prev => [...prev, '>> AUTHENTICATION TRIAL: FAILED. INPUT INVALID.']);
      return;
    }

    if (parsedAnswer === correctAnswer) {
      setError(null);
      setTerminalLogs(prev => [
        ...prev,
        `>> AUTHENTICATION TRIAL: SUCCESS. EVALUATED ${num1} + ${num2} = ${parsedAnswer}.`,
        'BYPASS GRANTED. TRANSMITTING TERMINAL RIGHTS...'
      ]);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } else {
      setError('ACCESS DENIED: INVALID EVALUATION.');
      setTerminalLogs(prev => [
        ...prev,
        `>> AUTHENTICATION TRIAL: DENIED. TARGET: ${correctAnswer}, RECEIVED: ${parsedAnswer}.`
      ]);
      generateCaptcha();
    }
  };

  return (
    <Card 
      title="PROXIMITY_GATEWAY_V6.0.EXE" 
      titleIcon={<Terminal size={14} className="text-white animate-pulse" />}
      headerExtra={
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500 opacity-70"></span>
          <span className="w-2.5 h-2.5 bg-yellow-500 opacity-70"></span>
          <span className="w-2.5 h-2.5 bg-green-500 opacity-70"></span>
        </div>
      }
      className="max-w-lg"
    >
      {/* Console log outputs */}
      <div className="font-mono text-[11px] text-[#71717A] bg-black p-4 border border-[#71717A]/40 mb-6 h-36 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {terminalLogs.map((log, index) => (
          <div key={index} className={log.includes('SUCCESS') ? 'text-green-400' : log.includes('DENIED') || log.includes('FAILED') ? 'text-red-500' : ''}>
            {log}
          </div>
        ))}
      </div>

      {/* Captcha Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block font-mono text-xs text-white tracking-widest uppercase">
            HUMAN CAPTCHA VERIFICATION
          </label>
          <div className="flex items-center justify-between bg-black border border-[#71717A] p-4">
            <span className="font-mono text-sm tracking-wider text-white">
              EVALUATE: <span className="text-white underline font-bold">{num1} + {num2}</span> = ?
            </span>
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-[#71717A] hover:text-white transition-snap p-1 cursor-pointer"
              title="Refresh Captcha"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="captcha-input" className="block font-mono text-xs text-[#71717A] tracking-wider uppercase">
            ENTER COMPUTED METRIC
          </label>
          <input
            id="captcha-input"
            type="text"
            required
            autoComplete="off"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="TYPE AN ANSWER"
            className="w-full bg-black border border-[#71717A] py-3 px-4 font-mono text-white text-sm focus:border-white focus:outline-none transition-snap uppercase placeholder-[#71717A]/50"
          />
        </div>

        {error && (
          <div className="font-mono text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-3 py-2 animate-pulse">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          icon={<ArrowRight size={14} />}
          className="w-full"
        >
          EXECUTE BYPASS
        </Button>
      </form>
    </Card>
  );
};
