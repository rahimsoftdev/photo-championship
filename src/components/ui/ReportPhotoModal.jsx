import { useState } from "react";
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

//reason in array formate
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [message, setMessage] = useState("");
  const [submittedReport, setSubmittedReport] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Open the report modal and reset the previous form state.
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

  // Submit the report and display a confirmation.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedReason) return;

    const reason = reportReasons.find(
      (item) => item.id === selectedReason
    );

    setSubmittedReport({
      reason: reason.title,
      message: message.trim(),
    });

    setShowSuccess(true);
  };

  // Close the modal after successful submission.
  const handleFinish = () => {
    setIsOpen(false);
  };

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

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-3 sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClose();
            }
          }}
        >
          {/* Modal panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-modal-title"
            className="flex max-h-[92vh] w-full max-w-[580px] flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl"
          >
            {!showSuccess ? (
              <>
                {/* Modal header */}
                <div className="flex items-start justify-between border-b border-[#E5E7EB] px-4 py-4 sm:px-5">
                  <div>
                    <h2
                      id="report-modal-title"
                      className="text-base font-bold text-[#111827]"
                    >
                      Report This Photo
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-subTitleText">
                      Help us keep the community safe. Please tell us what
                      is wrong with this content.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close report modal"
                    className="ml-3 rounded-md p-1 text-[#9CA3AF] transition hover:bg-gray-100 hover:text-[#111827]"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Report form */}
                <form
                  onSubmit={handleSubmit}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="overflow-y-auto px-4 py-4 sm:px-5">
                    <h3 className="text-xs font-semibold text-[#111827]">
                      Why are you reporting {photoTitle}?
                    </h3>

                    <p className="mt-1 text-[11px] text-subTitleText">
                      Select the most relevant reason.
                    </p>

                    {/* Selectable report reason cards */}
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {reportReasons.map((reason) => {
                        const Icon = reason.icon;
                        const isSelected =
                          selectedReason === reason.id;

                        return (
                          <button
                            key={reason.id}
                            type="button"
                            onClick={() =>
                              handleSelectReason(reason.id)
                            }
                            aria-pressed={isSelected}
                            className={`relative flex min-h-[65px] items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                              isSelected
                                ? "border-primary bg-[#F5F5FF] ring-1 ring-primary"
                                : "border-[#E5E7EB] bg-white hover:border-primary/50 hover:bg-gray-50"
                            }`}
                          >
                            {/* Icon background */}
                            <span className="flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-[4px] bg-[#F3F4F6] text-[#6B7280]">
                              <Icon size={17} />
                            </span>

                            {/* Reason title and description */}
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1">
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

                            {/* Selected indicator */}
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

                    {/* Additional explanation input */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-3">
                        <label
                          htmlFor="report-message"
                          className="text-xs font-semibold text-[#111827]"
                        >
                          Tell us more about the problem
                        </label>

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

                      {!selectedReason && (
                        <p className="mt-1 text-[10px] text-subTitleText">
                          Please select a reason before submitting.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] bg-white px-4 py-3 sm:px-5">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-medium text-[#374151] transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!selectedReason}
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Successful submission feedback */
              <div className="px-5 py-8 sm:px-7 sm:py-10">
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close success message"
                  className="float-right rounded-md p-1 text-[#9CA3AF] transition hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF3] text-[#16A34A]">
                  <FiCheck size={28} />
                </div>

                <h2 className="mt-4 text-center text-xl font-bold text-[#111827]">
                  Report Submitted Successfully
                </h2>

                <p className="mt-2 text-center text-sm leading-6 text-subTitleText">
                  Thank you for helping us keep the community safe.
                </p>

                {/* Display submitted reason and message */}
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
      )}
    </>
  );
};

export default ReportPhotoModal;
