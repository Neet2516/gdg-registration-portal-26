import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        ar?: boolean;
        'shadow-intensity'?: string;
        'interaction-prompt'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'disable-zoom'?: boolean;
        className?: string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}
