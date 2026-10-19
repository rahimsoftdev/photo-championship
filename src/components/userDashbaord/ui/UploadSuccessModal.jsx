import { useEffect } from "react";
import { Link } from "react-router";
import { FiCheck } from "react-icons/fi";

const UploadSuccessModal = ({ open, onClose, title, photoCount, price, selectionPath }) => {
    // Esc চাপলে বন্ধ হবে
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            style={{ animation: "fadeIn .2s ease-out" }}
            onClick={onClose}
        >
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes popIn { 0% { opacity: 0; transform: scale(.85) translateY(12px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
                @keyframes drawCheck { from { transform: scale(0) rotate(-20deg) } to { transform: scale(1) rotate(0) } }
            `}</style>

            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
                style={{ animation: "popIn .35s cubic-bezier(.2,.8,.2,1)" }}
            >
                <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
                    <span
                        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30"
                        style={{ animation: "drawCheck .5s .15s cubic-bezier(.2,.8,.2,1) both" }}
                    >
                        <FiCheck size={38} strokeWidth={3} />
                    </span>
                </div>

                <h2 id="success-title" className="text-lg font-bold text-gray-900">
                    Uploaded successfully!
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Your artwork has been submitted and is now being reviewed.
                </p>

                <div className="mt-4 space-y-1.5 rounded-xl bg-[#F1F2FB] p-3 text-left text-xs">
                    <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Title</span>
                        <span className="truncate font-semibold text-gray-800">{title}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Photos</span>
                        <span className="font-semibold text-gray-800">{photoCount}</span>
                    </div>
                    {price !== null && (
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Price</span>
                            <span className="font-semibold text-gray-800">${price.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <div className="mt-5 flex gap-2">
                    <Link
                        to={selectionPath}
                        className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Back to Selection
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-[#EE1C25] py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Upload another
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadSuccessModal;