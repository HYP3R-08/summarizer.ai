import React, { useCallback, useState } from "react";
import { ToastContext } from "./toastContext.js";

const AUTO_DISMISS_MS = 3800;

let idSeq = 0;

const TONE = {
  success: "bg-[#173a2a] text-[#c7f5df] border-emerald-500/30",
  error: "bg-[#3a1717] text-[#f7cccc] border-lgred/40",
  info: "bg-surface text-white2 border-white/10",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone) => {
      const id = ++idSeq;
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => remove(id), AUTO_DISMISS_MS);
    },
    [remove]
  );

  const api = {
    success: (message) => push(message, "success"),
    error: (message) => push(message, "error"),
    info: (message) => push(message, "info"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[min(92vw,22rem)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            onClick={() => remove(t.id)}
            className={`animate-toast-in cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium shadow-xl shadow-black/30 ${TONE[t.tone]}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
