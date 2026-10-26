import { useEffect, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import ModalShell, { SuccessView } from "./ModalShell";

/**
 * Delete confirmation modal
 * - Cancel  -> modal bondho (kichu delete hoy na)
 * - Delete  -> "deleted successfully" feedback dekhay, tarpor onDeleted() call hoy
 */
const DeleteConfirmModal = ({ open, artworkTitle, onCancel, onDeleted }) => {
  const [done, setDone] = useState(false);

  const onDeletedRef = useRef(onDeleted);
  onDeletedRef.current = onDeleted;

  useEffect(() => {
    if (open) setDone(false);
  }, [open]);

  // Success dekhanor kichukkhon por card remove hobe
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => onDeletedRef.current?.(), 1500);
    return () => clearTimeout(timer);
  }, [done]);

  // Success dekhanor somoy X / backdrop / Esc chaple o delete finish hobe
  const handleClose = () => {
    if (done) onDeleted?.();
    else onCancel?.();
  };

  return (
    <ModalShell open={open} onClose={handleClose} maxWidth="sm:max-w-sm">
      {done ? (
        <SuccessView
          title="Deleted Successfully!"
          text="Your artwork has been deleted."
          onDone={() => onDeleted?.()}
        />
      ) : (
        <div className="flex flex-col items-center px-1 pb-1 pt-4 text-center sm:pt-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#D00000]">
            <FiTrash2 size={24} />
          </span>

          <h3 className="mt-4 text-lg font-bold text-gray-900">Delete Artwork?</h3>
          <p className="mt-1.5 break-words text-sm text-gray-500">
            Are you sure you want to delete{" "}
            {artworkTitle ? (
              <span className="font-semibold text-gray-700">"{artworkTitle}"</span>
            ) : (
              "this artwork"
            )}
            ? This action cannot be undone.
          </p>

          <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setDone(true)}
              className="w-full rounded-xl bg-[#D00000] px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default DeleteConfirmModal;