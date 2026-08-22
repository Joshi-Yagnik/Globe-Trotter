'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed top-6 right-6 z-[300] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`px-5 py-3 rounded-xl text-sm font-medium backdrop-blur-xl border cursor-pointer animate-slide-in-right min-w-[280px]
              ${toast.type === 'success'
                ? 'bg-teal-400/15 text-teal-400 border-teal-400/30'
                : 'bg-red-400/15 text-red-400 border-red-400/30'
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
