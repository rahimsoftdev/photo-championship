import { useEffect } from "react";
import { Link } from "react-router";
import { FiCheck, FiClock, FiMail, FiShield } from "react-icons/fi";

const BusinessSuccessModal = ({ open, onClose, info, backPath }) => {
    // Esc চাপলে বন্ধ
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Modal open thakle background scroll lock
    useEffect(() => {
        if (!open) return;

        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;
        const prevOverflow = document.body.style.overflow;
        const prevPaddingRight = document.body.style.paddingRight;

        document.body.style.overflow = "hidden";
        // Scrollbar hide hole layout jump na korar jonno
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.paddingRight = prevPaddingRight;
        };
    }, [open]);

    if (!open || !info) return null;

    const steps = [
        { icon: FiMail, text: "Your portfolio has been sent to the administrator inbox." },
        { icon: FiShield, text: "It stays private and is not shown in public galleries." },
        { icon: FiClock, text: "Our team will review it and contact you about brand licensing." },
    ];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bl-success-title"
            className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
            style={{ animation: "blFade .2s ease-out" }}
            onClick={onClose}
        >
            <style>{`
                @keyframes blFade { from { opacity: 0 } to { opacity: 1 } }
                @keyframes blPop { 0% { opacity: 0; transform: scale(.85) translateY(12px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
                @keyframes blSlide { 0% { opacity: 0; transform: translateY(100%) } 100% { opacity: 1; transform: translateY(0) } }
                @keyframes blCheck { from { transform: scale(0) rotate(-20deg) } to { transform: scale(1) rotate(0) } }
                .bl-panel { animation: blSlide .35s cubic-bezier(.2,.8,.2,1); }
                @media (min-width: 640px) {
                    .bl-panel { animation: blPop .35s cubic-bezier(.2,.8,.2,1); }
                }
            `}</style>

            <div
                onClick={(e) => e.stopPropagation()}
                className="bl-panel flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[90dvh] sm:max-w-md sm:rounded-2xl"
            >
                {/* Modal er vitorer scrollable area */}
                <div className="overflow-y-auto overscroll-contain p-4 min-[400px]:p-5 sm:p-6">
                    <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center sm:mb-4 sm:h-20 sm:w-20">
                        <span className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
                        <span
                            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 sm:h-20 sm:w-20"
                            style={{ animation: "blCheck .5s .15s cubic-bezier(.2,.8,.2,1) both" }}
                        >
                            <FiCheck className="h-8 w-8 sm:h-[38px] sm:w-[38px]" strokeWidth={3} />
                        </span>
                    </div>

                    <div className="text-center">
                        <h2
                            id="bl-success-title"
                            className="text-base font-bold text-gray-900 sm:text-lg"
                        >
                            Portfolio submitted successfully!
                        </h2>
                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Thank you. Your 12-zodiac collection is now with us.
                        </p>
                    </div>

                    {/* সারাংশ */}
                    <div className="mt-4 space-y-1.5 rounded-xl bg-[#F1F2FB] p-3 text-xs">
                        <div className="flex justify-between gap-3">
                            <span className="shrink-0 text-gray-500">Reference ID</span>
                            <span className="break-all text-right font-mono font-semibold text-gray-800">
                                {info.referenceId}
                            </span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="shrink-0 text-gray-500">Collection</span>
                            <span className="min-w-0 truncate font-semibold text-gray-800">
                                {info.title}
                            </span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Photos</span>
                            <span className="font-semibold text-gray-800">{info.photoCount} / 12</span>
                        </div>
                        {info.hasVideo && (
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Video</span>
                                <span className="font-semibold text-gray-800">Attached</span>
                            </div>
                        )}
                    </div>

                    {/* পরবর্তী ধাপ */}
                    <ul className="mt-4 space-y-2.5">
                        {steps.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-2.5 text-xs text-gray-600">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8EAFB] text-[#4048CD]">
                                    <Icon size={12} />
                                </span>
                                <span className="pt-1">{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-5 flex flex-col gap-2 min-[400px]:flex-row">
                        <Link
                            to={backPath}
                            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Back to Selection
                        </Link>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg bg-[#EE1C25] py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            Submit another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessSuccessModal;