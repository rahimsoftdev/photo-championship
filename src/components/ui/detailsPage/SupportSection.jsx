import React, { useCallback, useState } from "react";
import { FaTimes } from "react-icons/fa";
import SupportSuccessModal from "./SupportSuccessModal"; // Sibling Component import
import { getSavedUserInfo } from "../../../utils/getUserInof";

const presetAmounts = [5, 10, 25, 50, 100];

const SupportSection = () => {
  // TODO: add real profile (apadtoto fake profile)
  const artistProfile = {
    name: "Wong Kar-Waí",
    role: "Digital Illustrator & Concept Artist. Your support helps me create new photos and tools for the community.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  };

  const [supportType, setSupportType] = useState("one-time"); // one-time | monthly
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentResultData, setPaymentResultData] = useState(null);

  // Stable function so the modal's effect doesn't re-run on every render.
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  // ফর্ম ভ্যালিডেশন: অ্যামাউন্ট (সিলেক্টেড বা কাস্টম) এবং নাম-ইমেইল দিতেই হবে
  const currentActiveAmount =
    customAmount !== "" ? Number(customAmount) : selectedAmount;
  const isFormValid =
    currentActiveAmount > 0 &&
    fullName.trim() !== "" &&
    emailAddress.trim() !== "";

  const handlePayNow = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Payment Info Object
    const paymentInfo = {
      artistName: artistProfile.name,
      supportType:
        supportType === "one-time" ? "One-Time Support" : "Monthly Support",
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
  const userInfo = getSavedUserInfo()

  return (
    <>
      <div
        className="mx-auto mt-10 w-full overflow-hidden rounded-2xl border shadow-sm sm:mt-12 lg:mt-section"
        style={{ borderColor: "#C6C6CD" }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 border-b p-4 sm:p-6"
          style={{ backgroundColor: "#F8F9FA", borderColor: "#C6C6CD" }}
        >
          {/* min-w-0 lets the text wrap instead of pushing the close button out */}
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
            {/* TODO: add real profile */}
            <img
              src={userInfo.image}
              alt={artistProfile.name}
              className="size-8 shrink-0 rounded-full border border-white object-cover shadow-sm sm:size-14"
            />
            <div className="min-w-0">
              <h2 className="break-words text-sm font-bold leading-snug text-gray-900 sm:text-xl">
                Support {userInfo.name}
              </h2>
              <p className="mt-0.5 max-w-lg break-words text-xs leading-relaxed text-gray-700 sm:text-sm max-sm:line-clamp-2">
                {artistProfile.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close"
            className="shrink-0 rounded-md p-1.5 text-gray-700 transition-colors hover:bg-black/5 hover:text-black"
          >
            <FaTimes className="text-base sm:text-lg" />
          </button>
        </div>

        {/* Main content */}
        <div className="space-y-6 bg-white p-4 sm:space-y-7 sm:p-6 md:p-8">
          {/* Choose How You'd Like to Support */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900 sm:text-base md:text-lg">
              Choose How You'd Like to Support
            </h3>
            {/* flex-wrap: radios stack on very narrow screens */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-800">
                <input
                  type="radio"
                  name="supportType"
                  checked={supportType === "one-time"}
                  onChange={() => setSupportType("one-time")}
                  className="size-4 cursor-pointer accent-primary"
                />
                One-Time Support
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-800">
                <input
                  type="radio"
                  name="supportType"
                  checked={supportType === "monthly"}
                  onChange={() => setSupportType("monthly")}
                  className="size-4 cursor-pointer accent-primary"
                />
                Monthly Support
              </label>
            </div>
          </div>

          {/* Select Amount */}
          <div>
            <h3 className="mb-3 text-sm font-bold text-gray-900 sm:text-base md:text-lg">
              Select Amount
            </h3>

            {/* 3 columns on mobile, 5 on sm+ */}
            <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
              {presetAmounts.map((amt) => {
                const isSelected =
                  customAmount === "" && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount(""); // কাস্টম ফিল্ড ক্লিয়ার হবে
                    }}
                    aria-pressed={isSelected}
                    className={`cursor-pointer rounded-xl border py-1.5 px-0.5 md:px-2 md:py-2.5 text-sm font-semibold transition-all sm:px-4 sm:text-base ${
                      isSelected
                        ? "border-secondary bg-red-50/30 text-secondary ring-1 ring-secondary"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                    style={{
                      borderColor: isSelected ? undefined : "#C6C6CD",
                    }}
                  >
                    ${amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input: full width on mobile, capped on sm+ */}
            <div className="relative flex w-full items-center sm:max-w-xs">
              <span className="absolute left-3.5 font-medium text-gray-500">
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom Amount"
                aria-label="Custom amount in USD"
                className="w-full rounded-xl border border-gray-300 bg-white py-1.5 md:py-2.5 pl-8 pr-14 text-base text-gray-800 outline-none placeholder:text-gray-400 focus:border-secondary"
              />
              <span className="absolute right-3.5 text-xs font-semibold text-gray-500">
                USD
              </span>
            </div>
          </div>

          {/* Your Details */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900 sm:text-base md:text-lg">
              Your Details
            </h3>

            {/* Stacked on mobile, side by side from md */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Full Name */}
              <div className="min-w-0">
                <label
                  htmlFor="support-full-name"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="support-full-name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-1.5 md:py-2.5 text-base text-gray-800 outline-none focus:border-secondary"
                />
              </div>

              {/* Email Address */}
              <div className="min-w-0">
                <label
                  htmlFor="support-email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="support-email"
                  type="email"
                  autoComplete="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 md:py-2.5 text-base text-gray-800 outline-none focus:border-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer: full-width stacked buttons on mobile, right-aligned row on sm+ */}
        <div
          className="flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:p-6"
          style={{ backgroundColor: "#F8F9FA", borderColor: "#C6C6CD" }}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="w-full cursor-pointer rounded-lg border border-gray-400 bg-white px-5 py-1.5 md:py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePayNow}
            disabled={!isFormValid}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2 md:py-2.5 text-sm font-medium text-white transition-all sm:w-auto ${
              isFormValid
                ? "cursor-pointer bg-secondary hover:opacity-90"
                : "cursor-not-allowed bg-gray-400 opacity-70"
            }`}
          >
            Pay Now →
          </button>
        </div>
      </div>

      {/* Sibling Popup Component */}
      <SupportSuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paymentData={paymentResultData}
      />
    </>
  );
};

export default SupportSection;