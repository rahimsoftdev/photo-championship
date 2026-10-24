import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import SupportSuccessModal from "./SupportSuccessModal"; // Sibling Component import

const SupportSection = () => {
  // TODO: add real profile (apadtoto fake profile)
  const artistProfile = {
    name: "Wong Kar-Waí",
    role: "Digital Illustrator & Concept Artist. Your support helps me create new photos and tools for the community.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  };

  const [supportType, setSupportType] = useState("one-time"); // one-time | monthly
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentResultData, setPaymentResultData] = useState(null);

  const presetAmounts = [5, 10, 25, 50, 100];

  // ফর্ম ভ্যালিডেশন: অ্যামাউন্ট (সিলেক্টেড বা কাস্টম) এবং নাম-ইমেইল দিতেই হবে
  const currentActiveAmount = customAmount !== "" ? Number(customAmount) : selectedAmount;
  const isFormValid = currentActiveAmount > 0 && fullName.trim() !== "" && emailAddress.trim() !== "";

  const handlePayNow = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Payment Info Object
    const paymentInfo = {
      artistName: artistProfile.name,
      supportType: supportType === "one-time" ? "One-Time Support" : "Monthly Support",
      amount: currentActiveAmount,
      fullName: fullName,
      emailAddress: emailAddress,
      method: "PayPal",
      timestamp: new Date().toISOString(),
    };

    // Console the object
    console.log("Payment Info Object:", paymentInfo);

    setPaymentResultData(paymentInfo);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setCustomAmount("");
    setFullName("");
    setEmailAddress("");
    setSelectedAmount(25);
  };

  return (
    <>
      <div
        className="w-full  mx-auto rounded-2xl overflow-hidden shadow-sm border mt-10 sm:mt-12 lg:mt-section "
        style={{ borderColor: "#C6C6CD" }}
      >
        {/* Header with #C6C6CD background */}
        <div
          className="p-4 sm:p-6 flex items-start justify-between border-b"
          style={{ backgroundColor: "#F8F9FA", borderColor: "#C6C6CD" }}
        >
          <div className="flex items-center gap-4">
            {/* TODO: add real profile */}
            <img
              src={artistProfile.avatar}
              alt={artistProfile.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-white shadow-sm"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Support {artistProfile.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 mt-0.5 max-w-lg">
                {artistProfile.role}
              </p>
            </div>
          </div>
          <button className="text-gray-700 hover:text-black p-1">
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Center / Main content with White background */}
        <div className="p-6 sm:p-8 bg-white space-y-6">

          {/* Choose How You'd Like to Support */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
              Choose How You'd Like to Support
            </h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                <input
                  type="radio"
                  name="supportType"
                  checked={supportType === "one-time"}
                  onChange={() => setSupportType("one-time")}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                One-Time Support
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800">
                <input
                  type="radio"
                  name="supportType"
                  checked={supportType === "monthly"}
                  onChange={() => setSupportType("monthly")}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                Monthly Support
              </label>
            </div>
          </div>

          {/* Select Amount */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
              Select Amount
            </h3>

            {/* Amount Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              {presetAmounts.map((amt) => {
                const isSelected = customAmount === "" && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount(""); // কাস্টম ফিল্ড ক্লিয়ার হবে
                    }}
                    className={`py-2.5 px-4 rounded-xl border text-base font-semibold transition-all cursor-pointer ${isSelected
                        ? "border-secondary text-secondary bg-red-50/30 ring-1 ring-secondary"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
                      }`}
                    style={{
                      borderColor: isSelected ? undefined : "#C6C6CD"
                    }}
                  >
                    ${amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="relative max-w-xs flex items-center">
              <span className="absolute left-3.5 text-gray-500 font-medium">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom Amount"
                className="w-full pl-8 pr-12 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-secondary text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-white"
              />
              <span className="absolute right-3.5 text-xs font-semibold text-gray-500">USD</span>
            </div>
          </div>

          {/* Your Details */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Your Details
            </h3>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-secondary text-sm sm:text-base text-gray-800 bg-white"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 outline-none focus:border-secondary text-sm sm:text-base text-gray-800 bg-white"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer with #C6C6CD background */}
        <div
          className="p-4 sm:p-6 flex items-center justify-end gap-3 border-t"
          style={{ backgroundColor: "#F8F9FA", borderColor: "#C6C6CD" }}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-400 bg-white text-gray-800 font-medium hover:bg-gray-50 text-sm cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePayNow}
            disabled={!isFormValid}
            className={`px-6 py-2.5 rounded-lg text-white font-medium text-sm flex items-center gap-2 transition-all ${isFormValid
                ? "bg-secondary hover:opacity-90 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-70"
              }`}
          >
            Pay Now →
          </button>
        </div>
      </div>

      {/* Sibling Popup Component */}
      <SupportSuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentData={paymentResultData}
      />
    </>
  );
};

export default SupportSection;