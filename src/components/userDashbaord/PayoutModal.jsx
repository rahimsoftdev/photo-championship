import React, { useEffect } from 'react';
import { FiX, FiTool } from 'react-icons/fi';

const PayoutModal = ({ isOpen, onClose }) => {
  // Close on Escape + lock background scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payout-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel: bottom sheet on mobile, centered card on larger screens */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-slate-800 hover:bg-gray-100 transition"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <FiTool className="w-6 h-6" />
        </div>

        <h3 id="payout-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
          Payout Not Available Yet
        </h3>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          The payout feature is currently under development and is not working right now.
          We are working hard to launch it soon. Please check back later.
        </p>

        <div className="mt-4 rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs text-primary font-medium">
          Your earnings are safe and will be available for withdrawal once payouts go live.
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-secondary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-95 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default PayoutModal;