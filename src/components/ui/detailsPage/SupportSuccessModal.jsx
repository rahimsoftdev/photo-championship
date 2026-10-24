
import React from "react";
import { useNavigate } from "react-router";
import { FaCheck, FaInfoCircle, FaWallet } from "react-icons/fa";

const SupportSuccessModal = ({ isOpen, onClose, paymentData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const amount = Number(paymentData?.amount ?? 25);
  const safeAmount = Number.isFinite(amount) && amount >= 0 ? amount : 25;

  const platformFee = safeAmount * 0.1;
  const artistReceives = safeAmount - platformFee;

  const artistName = paymentData?.artistName || "Wong kar-wai";
  const paymentMethod = paymentData?.method || "PayPal";

  const handleDone = () => {
    onClose();
  };

  const handleViewProfile = () => {
    onClose();
    navigate("/feed/gallery");
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center
      overflow-y-auto overscroll-contain bg-black/50 p-3
      backdrop-blur-md sm:p-5"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-success-title"
        className="my-auto flex max-h-[90dvh] w-full max-w-xl
        flex-col overflow-hidden rounded-2xl border border-[#C6C6CD]
        bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Fixed Header */}
        <div
          className="flex shrink-0 items-center justify-between gap-3
          border-b border-[#C6C6CD] bg-[#C6C6CD] p-4 sm:p-6"
        >
          <h3
            id="support-success-title"
            className="text-base font-semibold text-gray-800 sm:text-lg"
          >
            Successful Donation
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="shrink-0 rounded-lg p-1 text-xl font-bold
            text-gray-700 transition-colors hover:bg-black/10
            hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain
          bg-white p-4 sm:p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Success Message */}
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex size-16 shrink-0 items-center
                justify-center rounded-full shadow-sm"
                style={{ backgroundColor: "#D0FFCA" }}
              >
                <FaCheck
                  className="text-2xl"
                  style={{ color: "#118F00" }}
                />
              </div>

              <h2 className="mb-2 text-xl font-bold leading-snug
              text-gray-900 sm:text-2xl">
                Thank You for Supporting {artistName}!
              </h2>

              <p className="max-w-md text-sm leading-relaxed
              text-gray-600 sm:text-base">
                Your donation of ${safeAmount.toFixed(2)} has been
                successfully sent to support this artist.
              </p>

              {/* Payment Status */}
              <div
                className="mt-4 inline-flex items-center gap-2
                rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: "#D0FFCA",
                  color: "#118F00",
                }}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "#118F00" }}
                />
                Payment Successful
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-1 gap-6 border-t
            border-gray-100 pt-5 sm:grid-cols-2 sm:pt-6">
              {/* Transaction Breakdown */}
              <div className="min-w-0 space-y-4">
                <h4 className="text-base font-semibold text-gray-900">
                  Transaction Breakdown
                </h4>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between
                  gap-3 text-gray-600">
                    <span>Donation</span>
                    <span className="shrink-0 font-medium text-gray-900">
                      ${safeAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between
                  gap-3 text-gray-600">
                    <span className="flex items-center gap-1.5">
                      Platform Fee
                      <FaInfoCircle
                        className="shrink-0 text-xs text-gray-400"
                        title="Platform fee is 10%"
                      />
                    </span>

                    <span className="shrink-0 font-medium text-gray-900">
                      -${platformFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between
                  gap-3 border-t border-gray-200 pt-3 text-sm
                  font-semibold text-gray-900 sm:text-base">
                    <span>Artist Receives</span>
                    <span className="shrink-0">
                      ${artistReceives.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Receipt Summary */}
              <div className="min-w-0 space-y-4 rounded-xl
              border border-gray-200 bg-gray-50 p-4">
                <h5 className="text-[11px] font-bold uppercase
                tracking-wider text-gray-400">
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
                  <p className="flex items-center gap-2 break-words
                  text-sm font-medium text-gray-900">
                    <FaWallet className="shrink-0 text-gray-600" />
                    {paymentMethod}
                  </p>
                </div>

                {paymentData?.transactionId && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">
                      Transaction ID
                    </p>
                    <p className="break-all text-sm font-medium text-gray-900">
                      {paymentData.transactionId}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 border-t
                border-gray-200 pt-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">
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
                    <p className="text-sm font-medium text-gray-900">
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

        {/* Fixed Footer */}
        <div
          className="flex shrink-0 flex-col-reverse gap-3 border-t
          border-[#C6C6CD] bg-[#C6C6CD] p-4 sm:flex-row
          sm:items-center sm:justify-between sm:p-5"
        >
          <button
            type="button"
            onClick={handleViewProfile}
            className="w-full rounded-lg border border-gray-400
            bg-white px-4 py-2.5 text-sm font-medium text-gray-800
            transition-colors hover:bg-gray-50 sm:w-auto"
          >
            View Artist Profile
          </button>

          <button
            type="button"
            onClick={handleDone}
            className="w-full rounded-lg bg-secondary px-6 py-2.5
            text-sm font-medium text-white transition-opacity
            hover:opacity-90 sm:w-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportSuccessModal;
