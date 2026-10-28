import { memo } from 'react';

interface SparkleItem {
  id: number;
  shape: string;
  left: string;
  size: string;
  color: string;
  duration: string;
  delay: string;
  drift1: string;
  drift2: string;
  drift3: string;
}

// 28 pre-calculated deterministic sparkles to avoid hydration/render churn
const SPARKLES: SparkleItem[] = [
  { id: 1, shape: '✦', left: '4%', size: '18px', color: '#f2c35b', duration: '18s', delay: '-3s', drift1: '16px', drift2: '-14px', drift3: '10px' },
  { id: 2, shape: '✧', left: '11%', size: '13px', color: '#58A4B0', duration: '22s', delay: '-14s', drift1: '-12px', drift2: '18px', drift3: '-8px' },
  { id: 3, shape: '⋆', left: '17%', size: '11px', color: '#ffffff', duration: '16s', delay: '-8s', drift1: '10px', drift2: '-12px', drift3: '6px' },
  { id: 4, shape: '✦', left: '22%', size: '22px', color: '#de432c', duration: '20s', delay: '-18s', drift1: '-18px', drift2: '15px', drift3: '-12px' },
  { id: 5, shape: '✵', left: '27%', size: '15px', color: '#f2c35b', duration: '24s', delay: '-5s', drift1: '14px', drift2: '-16px', drift3: '12px' },
  { id: 6, shape: '✧', left: '33%', size: '12px', color: '#387A5B', duration: '19s', delay: '-11s', drift1: '-10px', drift2: '12px', drift3: '-6px' },
  { id: 7, shape: '✦', left: '39%', size: '20px', color: '#58A4B0', duration: '17s', delay: '-2s', drift1: '18px', drift2: '-15px', drift3: '8px' },
  { id: 8, shape: '⋆', left: '44%', size: '10px', color: '#ffffff', duration: '23s', delay: '-16s', drift1: '-8px', drift2: '14px', drift3: '-10px' },
  { id: 9, shape: '✦', left: '48%', size: '16px', color: '#f2c35b', duration: '21s', delay: '-9s', drift1: '12px', drift2: '-10px', drift3: '14px' },
  { id: 10, shape: '✧', left: '53%', size: '14px', color: '#de432c', duration: '18s', delay: '-6s', drift1: '-14px', drift2: '16px', drift3: '-12px' },
  { id: 11, shape: '✦', left: '58%', size: '24px', color: '#3168E0', duration: '25s', delay: '-19s', drift1: '20px', drift2: '-18px', drift3: '10px' },
  { id: 12, shape: '⋆', left: '63%', size: '11px', color: '#ffffff', duration: '15s', delay: '-13s', drift1: '-12px', drift2: '10px', drift3: '-8px' },
  { id: 13, shape: '✵', left: '68%', size: '16px', color: '#f2c35b', duration: '20s', delay: '-4s', drift1: '15px', drift2: '-14px', drift3: '12px' },
  { id: 14, shape: '✦', left: '73%', size: '21px', color: '#58A4B0', duration: '19s', delay: '-15s', drift1: '-16px', drift2: '18px', drift3: '-10px' },
  { id: 15, shape: '✧', left: '79%', size: '13px', color: '#de432c', duration: '22s', delay: '-7s', drift1: '10px', drift2: '-12px', drift3: '14px' },
  { id: 16, shape: '✦', left: '84%', size: '19px', color: '#f2c35b', duration: '17s', delay: '-1s', drift1: '-14px', drift2: '16px', drift3: '-8px' },
  { id: 17, shape: '⋆', left: '89%', size: '12px', color: '#ffffff', duration: '24s', delay: '-17s', drift1: '12px', drift2: '-10px', drift3: '6px' },
  { id: 18, shape: '✦', left: '94%', size: '23px', color: '#387A5B', duration: '21s', delay: '-10s', drift1: '-18px', drift2: '14px', drift3: '-12px' },
  { id: 19, shape: '✧', left: '7%', size: '15px', color: '#de432c', duration: '26s', delay: '-12s', drift1: '14px', drift2: '-16px', drift3: '8px' },
  { id: 20, shape: '✦', left: '14%', size: '17px', color: '#f2c35b', duration: '16s', delay: '-20s', drift1: '-10px', drift2: '12px', drift3: '-14px' },
  { id: 21, shape: '⋆', left: '29%', size: '10px', color: '#ffffff', duration: '22s', delay: '-6s', drift1: '16px', drift2: '-12px', drift3: '10px' },
  { id: 22, shape: '✦', left: '36%', size: '20px', color: '#3168E0', duration: '18s', delay: '-14s', drift1: '-15px', drift2: '18px', drift3: '-6px' },
  { id: 23, shape: '✧', left: '50%', size: '13px', color: '#58A4B0', duration: '23s', delay: '-8s', drift1: '12px', drift2: '-14px', drift3: '15px' },
  { id: 24, shape: '✦', left: '65%', size: '18px', color: '#de432c', duration: '17s', delay: '-18s', drift1: '-16px', drift2: '12px', drift3: '-10px' },
  { id: 25, shape: '✵', left: '76%', size: '14px', color: '#f2c35b', duration: '25s', delay: '-3s', drift1: '18px', drift2: '-15px', drift3: '12px' },
  { id: 26, shape: '✦', left: '82%', size: '22px', color: '#58A4B0', duration: '19s', delay: '-11s', drift1: '-12px', drift2: '16px', drift3: '-14px' },
  { id: 27, shape: '⋆', left: '91%', size: '11px', color: '#ffffff', duration: '20s', delay: '-5s', drift1: '10px', drift2: '-12px', drift3: '8px' },
  { id: 28, shape: '✦', left: '96%', size: '16px', color: '#f2c35b', duration: '22s', delay: '-16s', drift1: '-14px', drift2: '10px', drift3: '-12px' },
];

export const FloatingSparkles = memo(function FloatingSparkles() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none select-none z-[1] overflow-hidden" 
      aria-hidden="true"
    >
      {SPARKLES.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute animate-sparkle-drift inline-block font-mono leading-none transition-transform"
          style={{
            left: sparkle.left,
            fontSize: sparkle.size,
            color: sparkle.color,
            animationDuration: sparkle.duration,
            animationDelay: sparkle.delay,
            filter: `drop-shadow(0 0 8px ${sparkle.color}88)`,
            ['--drift-1' as string]: sparkle.drift1,
            ['--drift-2' as string]: sparkle.drift2,
            ['--drift-3' as string]: sparkle.drift3,
          }}
        >
          {sparkle.shape}
        </span>
      ))}
    </div>
  );
});
