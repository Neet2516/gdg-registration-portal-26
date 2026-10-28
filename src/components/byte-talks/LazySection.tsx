import { useState, useRef, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';

export function LazySection({
  id,
  className = '',
  minHeight = '380px',
  children,
}: {
  id?: string;
  className?: string;
  minHeight?: string;
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If URL hash matches this section, render immediately
    if (id && window.location.hash === `#${id}`) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '450px 0px' }
    );

    observer.observe(el);

    // Broadcast handler for instant anchor link navigation
    const handleLazyTarget = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (
        customEvent.detail === 'all' ||
        (id && (customEvent.detail === `#${id}` || customEvent.detail === id))
      ) {
        setIsVisible(true);
      }
    };
    window.addEventListener('lazy-load-target', handleLazyTarget);

    const handleHashChange = () => {
      if (id && window.location.hash === `#${id}`) {
        setIsVisible(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('lazy-load-target', handleLazyTarget);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [id]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`lazy-section-container ${className}`}
      style={{ minHeight: isVisible ? undefined : minHeight }}
    >
      {isVisible ? (
        children
      ) : (
        <div className="flex items-center justify-center py-24 text-[#1c242b]/30">
          <LoaderCircle className="size-6 animate-spin text-[#de432c]/50" />
        </div>
      )}
    </div>
  );
}
