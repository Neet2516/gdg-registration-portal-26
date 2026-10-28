import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, LoaderCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // duration in ms, 0 or undefined for default (4000ms), Infinity for persistent
  createdAt: number;
}

export interface ToastOptions {
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (type: ToastType, title: string, message?: string, options?: ToastOptions) => string;
  dismissToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Omit<ToastItem, 'id'>>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Global event listener system so toast.* can be called outside of React components too
type ToastEventListener = (action: {
  type: 'add' | 'dismiss' | 'update';
  payload: any;
}) => void;

const listeners: Set<ToastEventListener> = new Set();

function emitToastEvent(action: { type: 'add' | 'dismiss' | 'update'; payload: any }) {
  listeners.forEach((listener) => listener(action));
}

// Global standalone toast API
export const toast = {
  success: (title: string, message?: string, options?: ToastOptions): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    emitToastEvent({
      type: 'add',
      payload: { id, type: 'success', title, message, duration: options?.duration ?? 4000, createdAt: Date.now() },
    });
    return id;
  },
  error: (title: string, message?: string, options?: ToastOptions): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    emitToastEvent({
      type: 'add',
      payload: { id, type: 'error', title, message, duration: options?.duration ?? 5000, createdAt: Date.now() },
    });
    return id;
  },
  warning: (title: string, message?: string, options?: ToastOptions): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    emitToastEvent({
      type: 'add',
      payload: { id, type: 'warning', title, message, duration: options?.duration ?? 4500, createdAt: Date.now() },
    });
    return id;
  },
  info: (title: string, message?: string, options?: ToastOptions): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    emitToastEvent({
      type: 'add',
      payload: { id, type: 'info', title, message, duration: options?.duration ?? 3500, createdAt: Date.now() },
    });
    return id;
  },
  loading: (title: string, message?: string): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    emitToastEvent({
      type: 'add',
      payload: { id, type: 'loading', title, message, duration: Infinity, createdAt: Date.now() },
    });
    return id;
  },
  dismiss: (id: string) => {
    emitToastEvent({ type: 'dismiss', payload: { id } });
  },
  update: (id: string, updates: Partial<Omit<ToastItem, 'id'>>) => {
    emitToastEvent({ type: 'update', payload: { id, updates } });
  },
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
      loading: toast.loading,
      dismiss: toast.dismiss,
      update: toast.update,
    };
  }
  return {
    toasts: context.toasts,
    success: (title: string, message?: string, options?: ToastOptions) => context.addToast('success', title, message, options),
    error: (title: string, message?: string, options?: ToastOptions) => context.addToast('error', title, message, options),
    warning: (title: string, message?: string, options?: ToastOptions) => context.addToast('warning', title, message, options),
    info: (title: string, message?: string, options?: ToastOptions) => context.addToast('info', title, message, options),
    loading: (title: string, message?: string) => context.addToast('loading', title, message, { duration: Infinity }),
    dismiss: context.dismissToast,
    update: context.updateToast,
  };
}

const typeConfig: Record<
  ToastType,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accentColor: string;
    bgColor: string;
    badgeBg: string;
    borderColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    accentColor: '#387A5B',
    bgColor: '#101715',
    badgeBg: 'bg-[#387A5B]',
    borderColor: 'border-[#387A5B]',
  },
  error: {
    icon: AlertCircle,
    accentColor: '#de432c',
    bgColor: '#181112',
    badgeBg: 'bg-[#de432c]',
    borderColor: 'border-[#de432c]',
  },
  warning: {
    icon: AlertTriangle,
    accentColor: '#f2c35b',
    bgColor: '#171510',
    badgeBg: 'bg-[#f2c35b]',
    borderColor: 'border-[#f2c35b]',
  },
  info: {
    icon: Info,
    accentColor: '#55a8a8',
    bgColor: '#101718',
    badgeBg: 'bg-[#55a8a8]',
    borderColor: 'border-[#55a8a8]',
  },
  loading: {
    icon: LoaderCircle,
    accentColor: '#3168e0',
    bgColor: '#10141d',
    badgeBg: 'bg-[#3168e0]',
    borderColor: 'border-[#3168e0]',
  },
};

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const config = typeConfig[item.type] || typeConfig.info;
  const IconComponent = config.icon;
  const isInfinite = item.duration === Infinity || !item.duration;
  const duration = item.duration || 4000;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(duration);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isInfinite) return;

    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        onDismiss(item.id);
      }, remainingTimeRef.current);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, isInfinite, item.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="assertive"
      className={`pointer-events-auto relative w-full max-w-[380px] overflow-hidden border-2 border-[#1c242b] bg-[#0d121a] p-3.5 sm:p-4 text-white shadow-[6px_6px_0_#000000] transition-transform`}
      style={{
        boxShadow: `5px 5px 0px #000000, inset 0 0 0 1px ${config.accentColor}33`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Type Badge Icon */}
        <div
          className={`shrink-0 size-8 sm:size-9 rounded border-2 border-[#1c242b] ${config.badgeBg} text-white flex items-center justify-center shadow-[2px_2px_0_#000000]`}
        >
          <IconComponent
            size={18}
            className={item.type === 'loading' ? 'animate-spin' : ''}
          />
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1 pr-1">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[0.6rem] font-black uppercase tracking-wider px-1.5 py-0.5 border border-[#1c242b] rounded-xs"
              style={{
                backgroundColor: `${config.accentColor}25`,
                color: item.type === 'warning' ? '#f2c35b' : '#ffffff',
              }}
            >
              {item.type}
            </span>
          </div>

          <h5 className="font-display text-[0.95rem] font-black uppercase tracking-tight text-white mt-1 leading-snug">
            {item.title}
          </h5>

          {item.message && (
            <p className="font-mono text-[0.72rem] leading-relaxed text-white/80 mt-0.5 break-words">
              {item.message}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          aria-label="Dismiss toast"
          className="shrink-0 size-6 rounded border border-white/20 bg-white/5 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      {/* Animated Time-out Bar (hidden for infinite/loading toasts) */}
      {!isInfinite && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: isPaused ? undefined : '0%' }}
          transition={{
            duration: duration / 1000,
            ease: 'linear',
          }}
          className="absolute bottom-0 left-0 h-[3px]"
          style={{ backgroundColor: config.accentColor }}
        />
      )}
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, options?: ToastOptions): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const duration = options?.duration ?? (type === 'loading' ? Infinity : type === 'error' ? 5000 : 4000);
      setToasts((prev) => [{ id, type, title, message, duration, createdAt: Date.now() }, ...prev.slice(0, 4)]);
      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Omit<ToastItem, 'id'>>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  // Subscribe to standalone toast.* method calls
  useEffect(() => {
    const listener: ToastEventListener = ({ type, payload }) => {
      if (type === 'add') {
        setToasts((prev) => [payload, ...prev.slice(0, 4)]);
      } else if (type === 'dismiss') {
        setToasts((prev) => prev.filter((t) => t.id !== payload.id));
      } else if (type === 'update') {
        setToasts((prev) =>
          prev.map((t) => (t.id === payload.id ? { ...t, ...payload.updates } : t))
        );
      }
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast, updateToast }}>
      {children}

      {/* Floating Toasts Viewport Container */}
      <aside
        aria-label="Notifications"
        className="pointer-events-none fixed top-4 right-4 z-[99999] flex max-w-[calc(100vw-32px)] flex-col gap-2.5 sm:top-6 sm:right-6"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
}
