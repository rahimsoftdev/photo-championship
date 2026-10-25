import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { FaCheck, FaInfoCircle, FaWallet } from "react-icons/fa";

const SupportSuccessModal = ({ isOpen, onClose, paymentData }) => {
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);

  // While the modal is open: lock page scroll, close on Escape,
  // move focus into the modal and restore it when closed.
  // Hooks must stay above the early return below.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // Hiding the scrollbar makes the layout jump, so add equal padding.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const amount = Number(paymentData?.amount ?? 25);
  const safeAmount = Number.isFinite(amount) && amount >= 0 ? amount : 25;

  const platformFee = safeAmount * 0.1;
  const artistReceives = safeAmount - platformFee;

  const artistName = paymentData?.artistName || "Wong kar-wai";
  const paymentMethod = paymentData?.method || "PayPal";

  const handleViewProfile = () => {
    onClose();
    navigate("/feed/gallery");
  };

  const modal = (
    // Full-screen overlay: dark tint + blur. Bottom sheet on mobile,
    // centered card on larger screens.
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        // Close only when the dark area itself is clicked, not the panel.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-success-title"
        className="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-[#C6C6CD] bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl"
      >
        {/* Fixed header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#C6C6CD] bg-[#C6C6CD] px-4 py-3 sm:px-6 sm:py-4">
          <h3
            id="support-success-title"
            className="text-base font-semibold text-gray-800 sm:text-lg"
          >
            Successful Donation
          </h3>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 rounded-lg p-1 text-xl font-bold leading-none text-gray-700 transition-colors hover:bg-black/10 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body: only this area scrolls on small screens */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white px-4 py-5 sm:p-6 md:p-8">
          <div className="space-y-5 sm:space-y-6">
            {/* Success message */}
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-3 flex size-14 shrink-0 items-center justify-center rounded-full shadow-sm sm:mb-4 sm:size-16"
                style={{ backgroundColor: "#D0FFCA" }}
              >
                <FaCheck
                  className="text-xl sm:text-2xl"
                  style={{ color: "#118F00" }}
                />
              </div>

              <h2 className="mb-2 max-w-full break-words text-lg font-bold leading-snug text-gray-900 sm:text-2xl">
                Thank You for Supporting {artistName}!
              </h2>

              <p className="max-w-md text-sm leading-relaxed text-gray-600 sm:text-base">
                Your donation of ${safeAmount.toFixed(2)} has been
                successfully sent to support this artist.
              </p>

              {/* Payment status */}
              <div
                className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: "#D0FFCA", color: "#118F00" }}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "#118F00" }}
                />
                Payment Successful
              </div>
            </div>

            {/* Transaction details: stacked on mobile, 2 columns on sm+ */}
            <div className="grid grid-cols-1 gap-5 border-t border-gray-100 pt-5 sm:grid-cols-2 sm:gap-6 sm:pt-6">
              {/* Transaction breakdown */}
              <div className="min-w-0 space-y-3 sm:space-y-4">
                <h4 className="text-base font-semibold text-gray-900">
                  Transaction Breakdown
                </h4>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3 text-gray-600">
                    <span>Donation</span>
                    <span className="shrink-0 font-medium text-gray-900">
                      ${safeAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-gray-600">
                    <span className="flex items-center gap-1.5">
                      Platform Fee
                      {/* title on a wrapper span so the tooltip actually shows */}
                      <span title="Platform fee is 10%" className="flex">
                        <FaInfoCircle
                          className="shrink-0 text-xs text-gray-400"
                          aria-label="Platform fee is 10%"
                        />
                      </span>
                    </span>

                    <span className="shrink-0 font-medium text-gray-900">
                      -${platformFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-sm font-semibold text-gray-900 sm:text-base">
                    <span>Artist Receives</span>
                    <span className="shrink-0">
                      ${artistReceives.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt summary */}
              <div className="min-w-0 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:space-y-4">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Receipt Summary
                </h5>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Artist Name</p>
                  <p className="break-words text-sm font-medium text-gray-900">
                    {artistName}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Amount Paid</p>
                  <p className="text-sm font-medium text-gray-900">
                    ${safeAmount.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Payment Method</p>
                  <p className="flex items-center gap-2 break-words text-sm font-medium text-gray-900">
                    <FaWallet className="shrink-0 text-gray-600" />
                    {paymentMethod}
                  </p>
                </div>

                {paymentData?.transactionId && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="break-all text-sm font-medium text-gray-900">
                      {paymentData.transactionId}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500">Date</p>
                    <p className="break-words text-sm font-medium text-gray-900">
                      {paymentData?.date ||
                        new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500">Time</p>
                    <p className="break-words text-sm font-medium text-gray-900">
                      {paymentData?.time ||
                        new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed footer: full-width stacked buttons on mobile, row on sm+.
            Bottom padding respects the phone's safe area (home indicator). */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#C6C6CD] bg-[#C6C6CD] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={handleViewProfile}
            className="w-full rounded-lg border border-gray-400 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            View Artist Profile
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-secondary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  // Render directly inside <body> so no parent (transform, overflow,
  // z-index) can hide or cover the modal.
  return createPortal(modal, document.body);
};

export default SupportSuccessModal;