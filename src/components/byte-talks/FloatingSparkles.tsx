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

// Reduced to 12 subtle, ambient sparkles across the screen
const SPARKLES: SparkleItem[] = [
  { id: 1, shape: '✦', left: '6%', size: '16px', color: '#f2c35b', duration: '20s', delay: '-4s', drift1: '14px', drift2: '-12px', drift3: '8px' },
  { id: 2, shape: '✧', left: '15%', size: '12px', color: '#58A4B0', duration: '24s', delay: '-15s', drift1: '-10px', drift2: '14px', drift3: '-6px' },
  { id: 3, shape: '✦', left: '24%', size: '18px', color: '#de432c', duration: '22s', delay: '-8s', drift1: '16px', drift2: '-14px', drift3: '10px' },
  { id: 4, shape: '⋆', left: '34%', size: '10px', color: '#ffffff', duration: '18s', delay: '-12s', drift1: '-8px', drift2: '10px', drift3: '-6px' },
  { id: 5, shape: '✦', left: '43%', size: '15px', color: '#f2c35b', duration: '25s', delay: '-3s', drift1: '12px', drift2: '-10px', drift3: '14px' },
  { id: 6, shape: '✧', left: '52%', size: '12px', color: '#387A5B', duration: '21s', delay: '-17s', drift1: '-12px', drift2: '14px', drift3: '-8px' },
  { id: 7, shape: '✦', left: '61%', size: '19px', color: '#58A4B0', duration: '23s', delay: '-9s', drift1: '15px', drift2: '-12px', drift3: '8px' },
  { id: 8, shape: '⋆', left: '70%', size: '10px', color: '#ffffff', duration: '17s', delay: '-6s', drift1: '-10px', drift2: '12px', drift3: '-8px' },
  { id: 9, shape: '✦', left: '78%', size: '17px', color: '#de432c', duration: '24s', delay: '-14s', drift1: '12px', drift2: '-14px', drift3: '10px' },
  { id: 10, shape: '✧', left: '86%', size: '14px', color: '#f2c35b', duration: '22s', delay: '-1s', drift1: '-12px', drift2: '10px', drift3: '-12px' },
  { id: 11, shape: '✦', left: '94%', size: '20px', color: '#3168E0', duration: '26s', delay: '-19s', drift1: '-16px', drift2: '12px', drift3: '-8px' },
  { id: 12, shape: '⋆', left: '48%', size: '11px', color: '#ffffff', duration: '19s', delay: '-11s', drift1: '8px', drift2: '-8px', drift3: '6px' },
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
            filter: `drop-shadow(0 0 6px ${sparkle.color}66)`,
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
