import { forwardRef } from 'react';
import webSpider from '../../../assets/images/web-spider.png';

interface SpiderProps {
  isCrawling?: boolean;
}

export const Spider = forwardRef<HTMLDivElement, SpiderProps>(({ isCrawling = false }, ref) => {
  return (
    <div
      ref={ref}
      className="spider-container absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none z-30 select-none"
      style={{
        width: '60px',
        height: '60px',
        transformOrigin: 'top center',
        willChange: 'transform, top, left',
      }}
    >
      {/* Self-contained CSS keyframes for organic idle physics and leg crawl wiggles */}
      <style>{`
        @keyframes spider-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05, 0.96); }
        }
        @keyframes spider-swing {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes spider-crawl {
          0%, 100% { transform: skewX(-3deg) scaleY(1.04) scaleX(0.96); }
          25% { transform: skewX(3deg) scaleY(0.96) scaleX(1.04); }
          50% { transform: skewY(-2deg) skewX(-3deg) scaleY(1.04) scaleX(0.96); }
          75% { transform: skewY(2deg) skewX(3deg) scaleY(0.96) scaleX(1.04); }
        }

        .spider-idle-body {
          animation: spider-breathe 2.4s ease-in-out infinite;
          transform-origin: center center;
        }

        .spider-idle-swing {
          animation: spider-swing 4s ease-in-out infinite;
          transform-origin: top center;
        }

        .spider-crawling-legs {
          animation: spider-crawl 0.25s linear infinite;
          transform-origin: center center;
        }
      `}</style>

      {/* Swinging Anchor wrapper */}
      <div className={`w-full h-full ${isCrawling ? '' : 'spider-idle-swing'}`}>
        {/* Breathing / Crawling Body wrapper */}
        <div className={`w-full h-full flex items-center justify-center ${isCrawling ? 'spider-crawling-legs' : 'spider-idle-body'}`}>
          <img
            src={webSpider}
            alt="Crawling Spider"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]"
            style={{
              // Adjust image orientation if the PNG is rotated (usually spiders are oriented vertically)
              transform: 'rotate(0deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
});

Spider.displayName = 'Spider';
