import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiMoreVertical,
  FiX,
  FiFileText,
  FiSlash,
  FiAlertTriangle,
  FiShield,
  FiEyeOff,
  FiMessageSquare,
  FiImage,
  FiSmile,
  FiCircle,
  FiCheckCircle,
  FiCheck,
} from "react-icons/fi";

// All available report reasons. Each item controls one selectable card in the modal.
const reportReasons = [
  {
    id: "copyright",
    title: "Copyright Infringement",
    description: "Uses my work or someone else's without permission",
    icon: FiFileText,
  },
  {
    id: "illegal",
    title: "Illegal or Prohibited Content",
    description: "Content that violates the law",
    icon: FiSlash,
  },
  {
    id: "harmful",
    title: "Harmful or Dangerous Content",
    description: "Promotes harm, violence or danger",
    icon: FiAlertTriangle,
  },
  {
    id: "offensive",
    title: "Offensive or Abusive Content",
    description: "Hateful, abusive or harassing content",
    icon: FiShield,
  },
  {
    id: "nudity",
    title: "Nudity or Sexual Content",
    description: "Explicit or non-consensual imagery",
    icon: FiEyeOff,
  },
  {
    id: "spam",
    title: "Spam or Misleading Content",
    description: "Scams, spam or deceptive posts",
    icon: FiMessageSquare,
  },
  {
    id: "stolen",
    title: "Stolen Photo",
    description: "My work, reposted without credit",
    icon: FiImage,
  },
  {
    id: "child-privacy",
    title: "Child Privacy/COPPA Violation",
    description: "Content that may violate children's online privacy rights",
    icon: FiSmile,
    priority: true,
  },
  {
    id: "other",
    title: "Other",
    description: "Something else that breaks the rules",
    icon: FiCircle,
  },
];

const ReportPhotoModal = ({ photoTitle = "this single photo" }) => {
  // Whether the modal is visible.
  const [isOpen, setIsOpen] = useState(false);

  // The id of the reason the user picked.
  const [selectedReason, setSelectedReason] = useState("");

  // Optional extra explanation typed by the user (max 500 characters).
  const [message, setMessage] = useState("");

  // Stores the submitted reason and message for the success screen.
  const [submittedReport, setSubmittedReport] = useState(null);

  // Switches the modal content from the form to the success screen.
  const [showSuccess, setShowSuccess] = useState(false);

  // While the modal is open: lock page scroll and close on Escape.
  useEffect(() => {
    if (!isOpen) return;

    // Save the current body styles so they can be restored on close.
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    // Hiding the page scrollbar makes the layout jump, so we add the
    // same amount of padding to keep the page in place.
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Close the modal when the Escape key is pressed.
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup: restore page scroll and remove the key listener.
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Open the report modal and reset any previous form state.
  const handleOpen = () => {
    setSelectedReason("");
    setMessage("");
    setSubmittedReport(null);
    setShowSuccess(false);
    setIsOpen(true);
  };

  // Close the modal.
  const handleClose = () => {
    setIsOpen(false);
  };

  // Select one report reason.
  const handleSelectReason = (reasonId) => {
    setSelectedReason(reasonId);
  };

  // Validate and submit the report, then show the confirmation screen.
  const handleSubmit = (event) => {
    event.preventDefault();

    // A reason is required before submitting.
    if (!selectedReason) return;

    const reason = reportReasons.find((item) => item.id === selectedReason);

    setSubmittedReport({
      reason: reason.title,
      message: message.trim(),
    });

    setShowSuccess(true);
  };

  // Close the modal after the success screen is acknowledged.
  const handleFinish = () => {
    setIsOpen(false);
  };

  // The modal markup. It is rendered through a portal (see below).
  const modal = (
    // Full-screen overlay: dark tint + blur on everything behind the modal.
    // The very high z-index keeps the modal above any other element.
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        // Close only when the dark area itself is clicked, not the panel.
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Modal panel: bottom sheet on mobile, centered card on larger screens */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="flex max-h-[92dvh] w-full max-w-[580px] flex-col overflow-hidden rounded-t-2xl border border-[#E5E7EB] bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl"
      >
        {!showSuccess ? (
          <>
            {/* Header stays fixed at the top while the body scrolls */}
            <div className="flex shrink-0 items-start justify-between border-b border-[#E5E7EB] px-4 py-4 sm:px-5">
              <div>
                <h2
                  id="report-modal-title"
                  className="text-base font-bold text-[#111827]"
                >
                  Report This Photo
                </h2>

                <p className="mt-1 text-xs leading-5 text-subTitleText">
                  Help us keep the community safe. Please tell us what is
                  wrong with this content.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close report modal"
                className="ml-3 shrink-0 rounded-md p-1 text-[#9CA3AF] transition hover:bg-gray-100 hover:text-[#111827]"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form wraps the scrollable body and the fixed footer */}
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              {/* Only this area scrolls when the content is taller than the modal.
                  overscroll-contain stops the page behind from scrolling. */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
                <h3 className="text-xs font-semibold text-[#111827]">
                  Why are you reporting {photoTitle}?
                </h3>

                <p className="mt-1 text-[11px] text-subTitleText">
                  Select the most relevant reason.
                </p>

                {/* Selectable reason cards: 1 column on mobile, 2 on larger screens */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {reportReasons.map((reason) => {
                    const Icon = reason.icon;
                    const isSelected = selectedReason === reason.id;

                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => handleSelectReason(reason.id)}
                        aria-pressed={isSelected}
                        className={`relative flex min-h-[65px] items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                          isSelected
                            ? "border-primary bg-[#F5F5FF] ring-1 ring-primary"
                            : "border-[#E5E7EB] bg-white hover:border-primary/50 hover:bg-gray-50"
                        }`}
                      >
                        {/* Reason icon with grey background */}
                        <span className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-[4px] bg-[#F3F4F6] text-[#6B7280]">
                          <Icon size={17} />
                        </span>

                        {/* Reason title, optional PRIORITY tag and description */}
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-1">
                            <span className="text-[11px] font-semibold leading-4 text-[#374151]">
                              {reason.title}
                            </span>

                            {reason.priority && (
                              <span className="shrink-0 text-[8px] font-bold text-red-500">
                                PRIORITY
                              </span>
                            )}
                          </span>

                          <span className="mt-0.5 block text-[10px] leading-[14px] text-subTitleText">
                            {reason.description}
                          </span>
                        </span>

                        {/* Check icon shown only on the selected card */}
                        {isSelected && (
                          <FiCheckCircle
                            size={15}
                            className="shrink-0 text-primary"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Optional detailed explanation */}
                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="report-message"
                      className="text-xs font-semibold text-[#111827]"
                    >
                      Tell us more about the problem
                    </label>

                    {/* Live character counter */}
                    <span className="shrink-0 text-[10px] text-subTitleText">
                      {message.length}/500
                    </span>
                  </div>

                  <textarea
                    id="report-message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value.slice(0, 500))
                    }
                    maxLength={500}
                    rows={3}
                    placeholder="Please briefly explain why you believe this content violates our rules."
                    className="mt-2 w-full resize-y rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-xs leading-5 text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-primary focus:ring-1 focus:ring-primary"
                  />

                  {/* Hint shown until a reason is picked */}
                  {!selectedReason && (
                    <p className="mt-1 text-[10px] text-subTitleText">
                      Please select a reason before submitting.
                    </p>
                  )}
                </div>
              </div>

              {/* Footer stays fixed at the bottom; buttons are full width on mobile */}
              <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#E5E7EB] bg-white px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-medium text-[#374151] transition hover:bg-gray-50 sm:flex-none sm:py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!selectedReason}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:py-2"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success screen: scrolls on its own if the screen is very small */
          <div className="relative overflow-y-auto overscroll-contain px-5 py-8 sm:px-7 sm:py-10">
            {/* Close button pinned to the top-right corner */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close success message"
              className="absolute right-3 top-3 rounded-md p-1 text-[#9CA3AF] transition hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>

            {/* Green success icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
              <FiCheck size={28} />
            </div>

            <h2 className="mt-4 text-center text-lg font-bold text-[#111827] sm:text-xl">
              Report Submitted Successfully
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-subTitleText">
              Thank you for helping us keep the community safe.
            </p>

            {/* Summary of what the user submitted */}
            <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-gray-50 p-4">
              <p className="text-[11px] font-medium text-subTitleText">
                Selected report reason
              </p>

              <p className="mt-1 text-sm font-semibold text-[#111827]">
                {submittedReport?.reason}
              </p>

              <p className="mt-4 text-[11px] font-medium text-subTitleText">
                Your message
              </p>

              {/* break-words keeps long text from overflowing on small screens */}
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#374151]">
                {submittedReport?.message ||
                  "No additional message provided."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Three-dot button that opens the report modal */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Report this photo"
        title="Report this photo"
        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[rgba(0,0,0,0.5)] text-white transition hover:bg-[rgba(0,0,0,0.7)]"
      >
        <FiMoreVertical size={20} />
      </button>

      {/* Render the modal directly inside <body> so no parent element
          (transform, overflow, z-index) can hide it or cover it. */}
      {isOpen && createPortal(modal, document.body)}
    </>
  );
};

export default ReportPhotoModal;