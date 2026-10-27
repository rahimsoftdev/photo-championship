import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { FiCheck, FiEye, FiMoreVertical, FiX } from "react-icons/fi";

const DETAILS_PATH = "/user-dashboard/orders";
const MENU_WIDTH = 176; // px (w-44)
const MENU_HEIGHT = 250; // নিচে জায়গা কম হলে উপরে খোলার হিসাবের জন্য
const EDGE_GAP = 8;

const STATUS_OPTIONS = [
    { value: "processing", label: "Processing", dot: "bg-amber-500", text: "text-gray-800" },
    { value: "shipped", label: "Shipped", dot: "bg-purple-500", text: "text-gray-800" },
    { value: "delivered", label: "Delivered", dot: "bg-green-500", text: "text-gray-800" },
    { value: "cancelled", label: "Cancelled", dot: "bg-red-500", text: "text-red-600" },
];

const OrderRowMenu = ({ orderId, status, onStatusChange }) => {
    const navigate = useNavigate();
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    // null = বন্ধ | { mode: "sheet" } = মোবাইল | { mode: "dropdown", ...পজিশন } = বড় স্ক্রিন
    const [menu, setMenu] = useState(null);
    const open = menu !== null;
    const isSheet = menu?.mode === "sheet";

    const close = () => setMenu(null);

    const toggle = () => {
        if (open) return close();

        // ছোট স্ক্রিনে (<640px) নিচ থেকে ওঠা শিট, বড় স্ক্রিনে বাটনের পাশে ড্রপডাউন
        if (window.matchMedia("(max-width: 639px)").matches) {
            return setMenu({ mode: "sheet" });
        }

        const r = btnRef.current.getBoundingClientRect();
        const openUp = window.innerHeight - r.bottom < MENU_HEIGHT && r.top > MENU_HEIGHT;
        const left = Math.max(EDGE_GAP, Math.min(r.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - EDGE_GAP));

        setMenu({
            mode: "dropdown",
            left,
            ...(openUp ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
        });
    };

    // Esc, রিসাইজ করলে বন্ধ। ড্রপডাউনে বাইরে ক্লিক বা স্ক্রল করলেও বন্ধ।
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => e.key === "Escape" && close();
        const onDown = (e) => {
            if (!menuRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) close();
        };

        document.addEventListener("keydown", onKey);
        window.addEventListener("resize", close);

        if (!isSheet) {
            document.addEventListener("mousedown", onDown);
            window.addEventListener("scroll", close, true);
        }

        return () => {
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("resize", close);
            document.removeEventListener("mousedown", onDown);
            window.removeEventListener("scroll", close, true);
        };
    }, [open, isSheet]);

    // শিট খোলা থাকলে পেছনের পেজ স্ক্রল হবে না
    useEffect(() => {
        if (!isSheet) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isSheet]);

    const viewDetails = () => {
        close();
        navigate(`${DETAILS_PATH}/${orderId}`);
    };

    const changeStatus = (value) => {
        onStatusChange(orderId, value);
        close();
    };

    const items = (
        <>
            <button
                type="button"
                role="menuitem"
                onClick={viewDetails}
                className={`flex w-full items-center gap-2 bg-[#4048CD] text-left font-medium text-white transition hover:bg-[#343cb5] ${
                    isSheet ? "rounded-xl px-4 py-3.5 text-base" : "px-4 py-2.5 text-sm"
                }`}
            >
                <FiEye size={isSheet ? 18 : 14} />
                View Details
            </button>

            {STATUS_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    role="menuitem"
                    onClick={() => changeStatus(opt.value)}
                    className={`flex w-full items-center justify-between gap-2 text-left transition hover:bg-gray-50 ${
                        opt.text
                    } ${isSheet ? "rounded-xl px-4 py-3.5 text-base" : "px-4 py-2.5 text-sm"}`}
                >
                    <span className="flex items-center gap-2.5">
                        <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                        {opt.label}
                    </span>
                    {status === opt.value && <FiCheck size={isSheet ? 18 : 14} className="text-[#4048CD]" />}
                </button>
            ))}
        </>
    );

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Order actions"
                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 sm:h-8 sm:w-8"
            >
                <FiMoreVertical size={16} />
            </button>

            {open &&
                createPortal(
                    isSheet ? (
                        /* ---------- মোবাইল: নিচ থেকে ওঠা শিট ---------- */
                        <div
                            className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
                            onMouseDown={close}
                            onTouchStart={(e) => e.target === e.currentTarget && close()}
                        >
                            <div
                                ref={menuRef}
                                role="menu"
                                onMouseDown={(e) => e.stopPropagation()}
                                className="w-full rounded-t-3xl bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl"
                            >
                                <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-300" />

                                <div className="mb-3 flex items-center justify-between gap-3 px-1">
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                            Order actions
                                        </p>
                                        <p className="truncate font-mono text-sm font-bold text-gray-900">
                                            #{orderId}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={close}
                                        aria-label="Close"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                                    >
                                        <FiX size={16} />
                                    </button>
                                </div>

                                <div className="space-y-1">{items}</div>
                            </div>
                        </div>
                    ) : (
                        /* ---------- ট্যাবলেট / ডেস্কটপ: ড্রপডাউন ---------- */
                        <div
                            ref={menuRef}
                            role="menu"
                            style={{ position: "fixed", width: MENU_WIDTH, ...menu }}
                            className="z-50 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
                        >
                            {items}
                        </div>
                    ),
                    document.body
                )}
        </>
    );
};

export default OrderRowMenu;