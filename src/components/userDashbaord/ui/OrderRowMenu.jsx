import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FiCheck, FiMoreVertical } from "react-icons/fi";

const STATUS_OPTIONS = [
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

const OrderRowMenu = ({ orderId, status, onStatusChange }) => {
    const navigate = useNavigate();
    const btnRef = useRef(null);
    const menuRef = useRef(null);
    const [pos, setPos] = useState(null); // null = বন্ধ
    const open = pos !== null;

    const toggle = () => {
        if (open) return setPos(null);
        const r = btnRef.current.getBoundingClientRect();
        const openUp = window.innerHeight - r.bottom < 230; // নিচে জায়গা কম হলে উপরে খুলবে
        setPos({
            right: window.innerWidth - r.right,
            ...(openUp ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
        });
    };

    // বাইরে ক্লিক, Esc, স্ক্রল বা রিসাইজ করলে বন্ধ
    useEffect(() => {
        if (!open) return;
        const close = () => setPos(null);
        const onDown = (e) => {
            if (!menuRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) close();
        };
        const onKey = (e) => e.key === "Escape" && close();

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        window.addEventListener("scroll", close, true);
        window.addEventListener("resize", close);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("scroll", close, true);
            window.removeEventListener("resize", close);
        };
    }, [open]);

    const itemClass =
        "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-gray-800 transition hover:bg-gray-50";

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Order actions"
                className="rounded-md p-1.5 text-gray-600 transition hover:bg-gray-100"
            >
                <FiMoreVertical size={16} />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    style={{ position: "fixed", ...pos }}
                    className="z-50 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
                >
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setPos(null);
                            navigate(`/user-dashboard/orders/${orderId}`);
                        }}
                        className="w-full bg-[#4048CD] px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-[#343cb5]"
                    >
                        View Details
                    </button>

                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                onStatusChange(orderId, opt.value);
                                setPos(null);
                            }}
                            className={itemClass}
                        >
                            {opt.label}
                            {status === opt.value && <FiCheck size={14} className="text-[#4048CD]" />}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
};

export default OrderRowMenu;