import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type Toast = {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error';
};

type ToastContextValue = {
  showToast: (message: string, type?: Toast['type']) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    // newest first
    setToasts((t) => [{ id, message, type }, ...t]);
    window.setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div aria-live="polite" className="fixed z-[9999] right-6 top-6 flex flex-col gap-3 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg border flex items-start gap-3 text-sm font-medium transition-transform transform ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white border-gray-100 text-gray-900'}`}
          >
            <div className="flex-1 break-words">
              {toast.message}
            </div>
            <button
              aria-label="Dismiss"
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 ml-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
