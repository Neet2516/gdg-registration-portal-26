import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

interface SpiderAnimationProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  spiderRef: React.RefObject<HTMLDivElement | null>;
  threadRef: React.RefObject<SVGSVGElement | null>;
  silkShooterRef: React.RefObject<SVGSVGElement | null>;
  cardsCount: number;
}

export const useSpiderAnimation = ({
  containerRef,
  trackRef,
  spiderRef,
  threadRef,
  silkShooterRef,
  cardsCount,
}: SpiderAnimationProps) => {
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const spider = spiderRef.current;
    const threadSVG = threadRef.current;
    const silkShooter = silkShooterRef.current;

    if (!container || !track || !spider || !threadSVG || !silkShooter) return;

    // Wait for elements to be rendered and images loaded to calculate positions accurately
    const initTimeline = () => {
      const cards = track.querySelectorAll('.gallery-card');
      if (cards.length === 0) return;

      const thread = threadSVG.querySelector('.thread-path');
      const threadCore = threadSVG.querySelector('.thread-core');

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const centerY = viewportHeight * 0.45; // Spider sits slightly above center viewport

      // Card offset configurations depending on mobile/desktop
      const isMobile = viewportWidth < 768;
      const cardOffsetX = isMobile ? viewportWidth * 0.05 : viewportWidth * 0.22;
      const cardWidth = isMobile ? viewportWidth * 0.88 : 580;
      const cardHeight = isMobile ? 260 : 380;

      // Reset coordinates
      gsap.set(spider, { x: 0, y: centerY, rotation: 0 });

      // Helper to update thread SVG path dynamically based on spider coordinates
      const updateThreadPath = (x: number, y: number) => {
        const startX = 0; // Center thread starting point relative to container width center
        const startY = 0;
        const endX = x;
        const endY = y;
        
        // Organic inertia sagging curve
        const controlX = x * 0.45;
        const controlY = startY + (endY - startY) * 0.65;
        const pathData = `M ${startX} 0 Q ${controlX} ${controlY} ${endX} ${endY}`;
        
        if (thread) thread.setAttribute('d', pathData);
        if (threadCore) threadCore.setAttribute('d', pathData);
      };

      // Set initial straight thread
      updateThreadPath(0, centerY);

      // Create the master scrub timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: `+=${cardsCount * 105}vh`, // Pinned duration based on card count
          pin: true,
          scrub: 1.1, // Smooth scrub easing
          invalidateOnRefresh: true,
        },
      });

      // Clear shooter lines
      silkShooter.innerHTML = '';

      // Set up the timeline animations for each card
      cards.forEach((card, idx) => {
        const isLeft = idx % 2 === 0;
        const cardEl = card as HTMLElement;
        // Vertical offset for card position inside the scrolling track
        
        // 1. Move camera / track from the previous card position to this card position
        const targetTrackY = -((idx * 110) * (viewportHeight / 100));
        
        // Start crawl animation state
        masterTl.add(() => {
          spider.classList.add('is-crawling');
        }, '+=0.01');

        masterTl.to(track, {
          y: targetTrackY,
          duration: 3,
          ease: 'power2.inOut',
        });

        // Stretch the thread to accommodate any minor camera velocity sway
        masterTl.to(spider, {
          y: centerY + 15,
          duration: 1.5,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut',
        }, '<');

        // End crawl animation state
        masterTl.add(() => {
          spider.classList.remove('is-crawling');
        });

        // 2. Spider spiral movement around the card
        const cardCenterY = centerY;
        const targetX = isLeft ? -cardOffsetX : cardOffsetX;

        // Define procedural spiral points relative to viewport center (spider's origin)
        const spiralPoints = isLeft
          ? [
              { x: 0, y: cardCenterY },
              // Loop top-right
              { x: targetX + cardWidth * 0.45, y: cardCenterY - cardHeight * 0.55 },
              // Loop top-left
              { x: targetX - cardWidth * 0.55, y: cardCenterY - cardHeight * 0.55 },
              // Loop bottom-left
              { x: targetX - cardWidth * 0.58, y: cardCenterY + cardHeight * 0.55 },
              // Loop bottom-right (shooting position)
              { x: targetX + cardWidth * 0.52, y: cardCenterY + cardHeight * 0.2 },
            ]
          : [
              { x: 0, y: cardCenterY },
              // Loop top-left
              { x: targetX - cardWidth * 0.45, y: cardCenterY - cardHeight * 0.55 },
              // Loop top-right
              { x: targetX + cardWidth * 0.55, y: cardCenterY - cardHeight * 0.55 },
              // Loop bottom-right
              { x: targetX + cardWidth * 0.58, y: cardCenterY + cardHeight * 0.55 },
              // Loop bottom-left (shooting position)
              { x: targetX - cardWidth * 0.52, y: cardCenterY + cardHeight * 0.2 },
            ];

        // Animate the spider along the motion path with auto-rotation
        masterTl.to(spider, {
          motionPath: {
            path: spiralPoints,
            curviness: 1.5,
            autoRotate: true,
          },
          duration: 3.5,
          ease: 'power1.inOut',
          onUpdate: function () {
            // Retrieve current coordinates mapped by motionPath
            const currentX = gsap.getProperty(spider, 'x') as number;
            const currentY = gsap.getProperty(spider, 'y') as number;
            updateThreadPath(currentX, currentY);
          },
        });

        // 3. Shoot Silk & Procedural Web Reveal
        masterTl.add(() => {
          // Render shoot silk lines in SVG overlay
          const spiderX = gsap.getProperty(spider, 'x') as number;
          const spiderY = gsap.getProperty(spider, 'y') as number;

          // Absolute positions relative to shooter viewport
          const sX = viewportWidth / 2 + spiderX;
          const sY = spiderY;

          // Anchor targets: Shoot silk to card corners
          const rect = cardEl.getBoundingClientRect();
          const targetCoords = [
            { x: rect.left, y: rect.top },
            { x: rect.right, y: rect.top },
            { x: rect.left, y: rect.bottom },
            { x: rect.right, y: rect.bottom },
          ];

          silkShooter.innerHTML = ''; // Reset

          // Draw animated shooting SVG paths
          targetCoords.forEach((tc, cIdx) => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${sX} ${sY} L ${tc.x} ${tc.y}`);
            path.setAttribute('stroke', 'rgba(255, 255, 255, 0.95)');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('fill', 'none');
            
            // Generate dash array for shoot animation
            const length = Math.hypot(tc.x - sX, tc.y - sY);
            path.setAttribute('stroke-dasharray', length.toString());
            path.setAttribute('stroke-dashoffset', length.toString());

            silkShooter.appendChild(path);

            // Animate shot
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 0.18,
              ease: 'power3.out',
              delay: cIdx * 0.04,
              onComplete: () => {
                // Fade out shooting silk
                gsap.to(path, {
                  opacity: 0,
                  duration: 0.35,
                  delay: 0.1,
                  onComplete: () => path.remove(),
                });
              },
            });
          });

          // Trigger web drawing & card image reveal after first web hit
          setTimeout(() => {
            cardEl.classList.add('is-revealed');
          }, 100);
        });

        // Pause to let the card draw-in and shine sweep play
        masterTl.to({}, { duration: 1.5 });

        // 4. Return to Center thread
        masterTl.to(spider, {
          x: 0,
          y: centerY,
          rotation: 0, // Settle back to vertical
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: function () {
            const currentX = gsap.getProperty(spider, 'x') as number;
            const currentY = gsap.getProperty(spider, 'y') as number;
            updateThreadPath(currentX, currentY);
          },
        });

        // Add a slight overshoot bounce upon landing back on thread
        masterTl.to(spider, {
          y: centerY - 10,
          duration: 0.3,
          ease: 'power1.out',
          onUpdate: function () {
            const currentX = gsap.getProperty(spider, 'x') as number;
            const currentY = gsap.getProperty(spider, 'y') as number;
            updateThreadPath(currentX, currentY);
          },
        }).to(spider, {
          y: centerY,
          duration: 0.4,
          ease: 'bounce.out',
          onUpdate: function () {
            const currentX = gsap.getProperty(spider, 'x') as number;
            const currentY = gsap.getProperty(spider, 'y') as number;
            updateThreadPath(currentX, currentY);
          },
        });
      });
    };

    // Initialize after a short delay to ensure DOM paint has happened
    const timer = setTimeout(initTimeline, 400);

    // Re-initialize on window resize
    const handleResize = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      initTimeline();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [containerRef, trackRef, spiderRef, threadRef, silkShooterRef, cardsCount]);
};
