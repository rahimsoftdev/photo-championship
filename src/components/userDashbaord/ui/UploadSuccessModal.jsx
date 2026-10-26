import { useEffect } from "react";
import { Link } from "react-router";
import { FiCheck } from "react-icons/fi";

const UploadSuccessModal = ({
    open,
    onClose,
    message = "",
    fileCount = 0,
    price = null, // optional: dile Price row dekhabe
    selectionPath = "/user-dashboard/news-message",
}) => {
    // Esc chaple bondho hobe + modal open thakle background scroll lock
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4 backdrop-blur-sm"
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
                className="my-auto w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl bg-white p-5 sm:p-6 text-center shadow-2xl"
                style={{ animation: "popIn .35s cubic-bezier(.2,.8,.2,1)" }}
            >
                <div className="relative mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
                    <span
                        className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30"
                        style={{ animation: "drawCheck .5s .15s cubic-bezier(.2,.8,.2,1) both" }}
                    >
                        <FiCheck className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} />
                    </span>
                </div>

                <h2 id="success-title" className="text-base sm:text-lg font-bold text-gray-900">
                    Uploaded successfully!
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    Your message has been submitted and is now being reviewed.
                </p>

                <div className="mt-4 space-y-1.5 rounded-xl bg-[#ECEDFA] p-3 text-left text-xs">
                    {message && (
                        <div className="flex justify-between gap-3">
                            <span className="shrink-0 text-gray-500">Message</span>
                            <span className="min-w-0 truncate font-semibold text-gray-800">{message}</span>
                        </div>
                    )}
                    <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Files</span>
                        <span className="font-semibold text-gray-800">{fileCount}</span>
                    </div>
                    {typeof price === "number" && (
                        <div className="flex justify-between gap-3">
                            <span className="text-gray-500">Price</span>
                            <span className="font-semibold text-gray-800">${price.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2">
                    <Link
                        to={selectionPath}
                        className="flex-1 rounded-lg border border-gray-200 py-2.5 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Back to Selection
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg bg-[#EE1C25] py-2.5 px-3 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Upload another
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadSuccessModal;