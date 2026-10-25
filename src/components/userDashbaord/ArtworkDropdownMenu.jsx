import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiMoreVertical, FiTrash2, FiTrendingUp } from "react-icons/fi";

/**
 * 3 dot menu: Edit / Promote / Delete
 * Option e click korle menu bondho hoye oi function call hobe.
 * Bairе click ba Esc chaple menu bondho hobe.
 */
const ArtworkDropdownMenu = ({ onEdit, onPromote, onDelete }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const run = (fn) => () => {
    setOpen(false);
    fn?.();
  };

  const itemClass =
    "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-xs font-medium transition-colors";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Artwork options"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow backdrop-blur-sm transition hover:bg-white active:scale-95"
      >
        <FiMoreVertical size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1.5 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={run(onEdit)}
            className={`${itemClass} text-gray-700 hover:bg-gray-50`}
          >
            <FiEdit2 size={14} className="shrink-0" />
            Edit
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={run(onPromote)}
            className={`${itemClass} text-gray-700 hover:bg-gray-50`}
          >
            <FiTrendingUp size={14} className="shrink-0" />
            Promote
          </button>

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            role="menuitem"
            onClick={run(onDelete)}
            className={`${itemClass} text-[#D00000] hover:bg-red-50`}
          >
            <FiTrash2 size={14} className="shrink-0" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ArtworkDropdownMenu;