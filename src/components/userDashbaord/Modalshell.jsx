import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiX } from "react-icons/fi";

/**
 * Sob modal er common wrapper.
 * - Pichoner sob kichu blur hoye jay
 * - Modal open thakle page scroll hoy na, modal er vitore scroll hoy
 * - Esc ba backdrop e click korle bondho hoy (dismissible hole)
 * - Mobile e bottom sheet, sm+ e majhkhane card
 */
const ModalShell = ({
  open,
  onClose,
  children,
  maxWidth = "sm:max-w-md",
  dismissible = true,
}) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    // Page scroll lock
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape" && dismissible) onCloseRef.current?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dismissible]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center overscroll-contain bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className={`relative max-h-[92vh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-4 shadow-2xl sm:rounded-2xl sm:p-6 ${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        {dismissible && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 sm:right-4 sm:top-4"
          >
            <FiX size={16} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

/* Success feedback (edit / promote / delete shobar jonno ek-i) */
export const SuccessView = ({ title, text, onDone }) => (
  <div className="flex flex-col items-center px-2 py-6 text-center">
    <span className="relative flex h-16 w-16 items-center justify-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-[#059669]/25" />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#059669] text-white shadow">
        <FiCheck size={30} strokeWidth={3} />
      </span>
    </span>
    <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
    {text && <p className="mt-1 text-sm text-gray-500">{text}</p>}
    <button
      type="button"
      onClick={onDone}
      className="mt-6 w-full rounded-xl bg-[#059669] px-8 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 sm:w-auto"
    >
      Done
    </button>
  </div>
);

export default ModalShell;