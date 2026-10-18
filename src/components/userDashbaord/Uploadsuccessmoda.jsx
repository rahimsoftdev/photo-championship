import { useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";

const CONTENT = {
    competition: {
        title: "📷 Congratulations!",
        message:
            "Your photos have been uploaded and are now taking part in the voting competition. Good Luck!",
    },
    profile: {
        title: "Your photos have been uploaded successfully!",
        message:
            "Your photos are now available on your profile and can be viewed by other users. You can add them to a future competition anytime from your profile.",
    },
};

/**
 * Shown after a successful submit.
 * type = "competition" | "profile" decides which text is shown.
 */
const UploadSuccessModal = ({ isOpen, type, onClose, onGoHome, onUploadAnother }) => {
    // close on Escape + lock page scroll while open
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const { title, message } = CONTENT[type] ?? CONTENT.profile;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-success-title"
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md rounded-2xl bg-white px-6 pb-7 pt-8 text-center shadow-2xl sm:px-10"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                >
                    <FiX size={16} />
                </button>

                {/* check icon */}
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DADCF8]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-white">
                        <FiCheck size={18} strokeWidth={3} />
                    </span>
                </span>

                <h2
                    id="upload-success-title"
                    className="mx-auto mt-4 max-w-xs text-xl font-bold leading-snug text-gray-900"
                >
                    {title}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-gray-600">{message}</p>

                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={onGoHome}
                        className="rounded-md bg-[#EE1C25] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 active:scale-95"
                    >
                        Go to Homepage
                    </button>
                    <button
                        type="button"
                        onClick={onUploadAnother}
                        className="rounded-md bg-[#4048CD] px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 active:scale-95"
                    >
                        Upload Another Album
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadSuccessModal;