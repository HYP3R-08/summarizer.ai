import React, { useEffect } from "react";

// Accessible confirm modal used instead of window.confirm.
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div
        className="surface-card w-full max-w-sm p-6 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
        {message && <p className="text-white2/80 mb-6">{message}</p>}
        <div className="flex gap-3 justify-end">
          <button className="btn btn-ghost max-w-[9rem] h-11 text-base" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn max-w-[9rem] h-11 text-base" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
