import React from "react";
import { useNavigate } from "react-router";
import { FaCheck, FaInfoCircle, FaWallet } from "react-icons/fa";

const SupportSuccessModal = ({ isOpen, onClose, paymentData }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDone = () => {
    onClose();
  };

  const handleViewProfile = () => {
    navigate("/feed/gallery");
  };

  // পেমেন্ট ডাটা থেকে হিসাব বা ডিফল্ট মান
  const amount = parseFloat(paymentData?.amount || 25);
  const platformFee = amount * 0.1; // ১০% প্লাটফর্ম ফি ধরা যাক
  const artistReceives = amount - platformFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl bg-white border"
        style={{ borderColor: "#C6C6CD" }}
      >
        {/* Modal Header */}
        <div 
          className="p-4 sm:p-6 flex items-center justify-between border-b"
          style={{ backgroundColor: "#C6C6CD", borderColor: "#C6C6CD" }}
        >
          <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
            Successful Donation
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-700 hover:text-black text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body (White background) */}
        <div className="p-6 sm:p-8 bg-white space-y-6">
          {/* Success Icon */}
          <div className="flex flex-col items-center text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm"
              style={{ backgroundColor: "#D0FFCA" }}
            >
              <FaCheck className="text-2xl" style={{ color: "#118F00" }} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Thank You for Supporting {paymentData?.artistName || "Wong kar-wai"}!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-md">
              Your donation of ${amount.toFixed(2)} has been successfully sent to support this artist.
            </p>

            {/* Payment Successful Badge */}
            <div 
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
              style={{ backgroundColor: "#D0FFCA", color: "#118F00" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#118F00" }}></span>
              Payment Successful
            </div>
          </div>

          {/* Transaction Breakdown & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Left: Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Transaction Breakdown</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Donation</span>
                  <span className="font-medium text-gray-900">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 items-center">
                  <span className="flex items-center gap-1">
                    Platform Fee <FaInfoCircle className="text-xs text-gray-400" />
                  </span>
                  <span className="font-medium text-gray-900">-${platformFee.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold text-base text-gray-900">
                  <span>Artist Receives</span>
                  <span className="text-gray-900">${artistReceives.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Right: Receipt Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 text-xs sm:text-sm">
              <h5 className="font-bold text-gray-400 uppercase tracking-wider text-[11px]">
                Receipt Summary
              </h5>
              <div>
                <p className="text-gray-500 text-xs">Artist Name</p>
                <p className="font-medium text-gray-900">{paymentData?.artistName || "Emma Wilson"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Amount Paid</p>
                <p className="font-medium text-gray-900">${amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Payment Method</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <FaWallet className="text-gray-600" /> {paymentData?.method || "PayPal"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Transaction ID</p>
                <p className="font-medium text-gray-900">TXN-8472-991A-EW</p>
              </div>
              <div className="grid grid-cols-2 pt-1 border-t border-gray-200">
                <div>
                  <p className="text-gray-500 text-[11px]">Date</p>
                  <p className="font-medium text-gray-900">Oct 24, 2023</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[11px]">Time</p>
                  <p className="font-medium text-gray-900">14:32 EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div 
          className="p-4 sm:p-6 flex items-center justify-between border-t"
          style={{ backgroundColor: "#C6C6CD", borderColor: "#C6C6CD" }}
        >
          <button
            onClick={handleViewProfile}
            className="px-4 py-2.5 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium hover:bg-gray-50 text-sm cursor-pointer transition-colors"
          >
            View Artist Profile
          </button>
          <button
            onClick={handleDone}
            className="px-6 py-2.5 rounded-lg text-white font-medium bg-secondary hover:opacity-90 text-sm cursor-pointer transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportSuccessModal;