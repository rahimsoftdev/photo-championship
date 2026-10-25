import { useEffect, useId, useRef, useState } from "react";
import ModalShell, { SuccessView } from "./ModalShell";

const buildForm = (artwork = {}) => ({
  title: artwork.title ?? "",
  price: artwork.price ?? "",
  description: artwork.description ?? "",
});

const inputClass =
  "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base focus:border-blue-500 focus:outline-none sm:py-2 sm:text-sm";

/**
 * Edit modal
 * - Open hole ager (current) data input field e bosano thake
 * - User notun kore edit korte pare
 * - Save korle success feedback dekhay, tarpor modal bondho hoy
 */
const EditArtworkModal = ({ open, artwork, onClose, onSave }) => {
  const uid = useId();
  const [form, setForm] = useState(() => buildForm(artwork));
  const [saved, setSaved] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Modal khulle form ke current artwork data diye reset kora hobe
  useEffect(() => {
    if (open) {
      setForm(buildForm(artwork));
      setSaved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Save howar por kichukkhon feedback dekhiye auto close
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => onCloseRef.current?.(), 1600);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = form.title.trim();
    if (!title) return;

    const values = { title, description: form.description };
    if (form.price !== "") values.price = Number(form.price);

    onSave?.(values);
    setSaved(true);
  };

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="sm:max-w-lg">
      {saved ? (
        <SuccessView
          title="Artwork Updated!"
          text="Your changes have been saved successfully."
          onDone={onClose}
        />
      ) : (
        <>
          <h3 className="mb-4 pr-10 text-lg font-bold text-gray-900 sm:text-xl">
            Edit Artwork
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor={`${uid}-title`}
                className="mb-1 block text-xs font-semibold text-gray-700"
              >
                Title
              </label>
              <input
                id={`${uid}-title`}
                type="text"
                value={form.title}
                onChange={handleChange("title")}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor={`${uid}-price`}
                className="mb-1 block text-xs font-semibold text-gray-700"
              >
                Price ($)
              </label>
              <input
                id={`${uid}-price`}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={form.price}
                onChange={handleChange("price")}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`${uid}-description`}
                className="mb-1 block text-xs font-semibold text-gray-700"
              >
                Description
              </label>
              <textarea
                id={`${uid}-description`}
                rows={4}
                value={form.description}
                onChange={handleChange("description")}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200 sm:w-auto sm:py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 sm:w-auto sm:py-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </>
      )}
    </ModalShell>
  );
};

export default EditArtworkModal;