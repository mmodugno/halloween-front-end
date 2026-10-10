import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// const [toast, showToast] = useToast(); then render <Toast toast={toast} />.
// showToast(message, { tone: "success", action: { label, onClick }, duration }).
export function useToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), toast.duration);
    return () => clearTimeout(id);
  }, [toast]);

  const show = useCallback(
    (message, { tone = "default", action, duration = action ? 8000 : 2600 } = {}) =>
      setToast({ message, tone, action, duration, id: Date.now() }),
    []
  );
  const hide = useCallback(() => setToast(null), []);
  return [toast, show, hide];
}

export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role="status"
          className={`panel toast ${toast.tone === "success" ? "panel--mint" : ""}`}
          initial={{ opacity: 0, y: 24, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 24, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <span>{toast.message}</span>
          {toast.action && (
            <button type="button" className="link toast__action" onClick={toast.action.onClick}>
              {toast.action.label}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
