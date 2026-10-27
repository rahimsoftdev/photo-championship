
import React, { useEffect, useState } from 'react';
import {
  FiUploadCloud,
  FiChevronDown,
  FiX,
  FiCheckCircle,
  FiSend,
} from 'react-icons/fi';

const CollectionForm = () => {
  const [formData, setFormData] = useState({
    collectionTitle: '',
    category: 'Astrophotography',
    price: '',
    editionSize: '',
    description: '',
  });

  const [bannerImage, setBannerImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Lock background scroll and handle Escape key.
  useEffect(() => {
    if (!isSubmitted) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSubmitted(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setBannerImage(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }

    e.target.value = '';
  };

  const handleOthersUpload = (e) => {
    const files = Array.from(e.target.files || []);

    const newImages = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setOtherImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeBannerImage = () => {
    if (bannerImage?.preview) {
      URL.revokeObjectURL(bannerImage.preview);
    }

    setBannerImage(null);
  };

  const removeOtherImage = (index) => {
    setOtherImages((prev) => {
      const image = prev[index];

      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    removeBannerImage();

    otherImages.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setOtherImages([]);
    setFormData({
      collectionTitle: '',
      category: 'Astrophotography',
      price: '',
      editionSize: '',
      description: '',
    });

    setIsSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center font-sans">
      <div className="w-full rounded-2xl bg-[#ECEDFA] p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* COLLECTION TITLE */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              COLLECTION TITLE
            </label>

            <input
              type="text"
              name="collectionTitle"
              value={formData.collectionTitle}
              onChange={handleInputChange}
              placeholder="e.g., Celestial Archetypes of Fire"
              required
              className="w-full rounded-lg border-none bg-[#FAFAFF] px-4 py-3 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#4048cd]/30"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              CATEGORY
            </label>

            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full cursor-pointer appearance-none rounded-lg border-none bg-[#FAFAFF] px-4 py-3 text-sm text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-[#4048cd]/30"
              >
                <option value="Astrophotography">Astrophotography</option>
                <option value="Nature">Nature</option>
                <option value="Portrait">Portrait</option>
                <option value="Digital Art">Digital Art</option>
              </select>

              <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
            </div>
          </div>

          {/* PRICE */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Price
            </label>

            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="$2.00"
              required
              className="w-full rounded-lg border-none bg-[#FAFAFF] px-4 py-3 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#4048cd]/30"
            />
          </div>

          {/* EDITION SIZE */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Set Edition/Size
            </label>

            <input
              type="text"
              name="editionSize"
              value={formData.editionSize}
              onChange={handleInputChange}
              placeholder="Write edition or size"
              required
              className="w-full rounded-lg border-none bg-[#FAFAFF] px-4 py-3 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#4048cd]/30"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Description
            </label>

            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write description about this product"
              required
              className="w-full resize-y rounded-lg border-none bg-[#FAFAFF] px-4 py-3 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#4048cd]/30"
            />
          </div>

          {/* BANNER IMAGE */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Product Banner Image
            </label>

            <div className="flex min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center sm:p-6">
              {bannerImage ? (
                <div className="group relative h-32 w-full max-w-xs">
                  <img
                    src={bannerImage.preview}
                    alt="Banner preview"
                    className="h-full w-full rounded-lg object-cover shadow-sm"
                  />

                  <button
                    type="button"
                    onClick={removeBannerImage}
                    aria-label="Remove banner image"
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white transition hover:bg-red-600"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex w-full cursor-pointer flex-col items-center">
                  <div className="mb-2 rounded-full bg-[#EAEBF8] p-2.5 text-slate-700">
                    <FiUploadCloud size={20} />
                  </div>

                  <p className="text-xs font-bold text-gray-800">
                    Drag and drop photos here
                  </p>

                  <p className="mt-1 text-[11px] text-gray-400">
                    Or click to browse from your computer
                  </p>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-400">
                    <span>JPEG, PNG</span>
                    <span>•</span>
                    <span>Max 1 photo</span>
                    <span>•</span>
                    <span>1920×1080px recommended</span>
                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* OTHER IMAGES */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Other Images
            </label>

            <div className="flex min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center sm:p-6">
              {otherImages.length > 0 && (
                <div className="mb-4 flex w-full flex-wrap justify-center gap-3">
                  {otherImages.map((img, idx) => (
                    <div
                      key={`${img.name}-${idx}`}
                      className="group relative h-20 w-20"
                    >
                      <img
                        src={img.preview}
                        alt={`Other image ${idx + 1}`}
                        className="h-full w-full rounded-lg object-cover shadow-sm"
                      />

                      <button
                        type="button"
                        onClick={() => removeOtherImage(idx)}
                        aria-label={`Remove image ${idx + 1}`}
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white transition hover:bg-red-600"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex w-full cursor-pointer flex-col items-center">
                <div className="mb-2 rounded-full bg-[#EAEBF8] p-2.5 text-slate-700">
                  <FiUploadCloud size={20} />
                </div>

                <p className="text-xs font-bold text-gray-800">
                  Drag and drop photos here
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  Or click to browse from your computer
                </p>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-400">
                  <span>JPEG, PNG</span>
                  <span>•</span>
                  <span>1920×1080px recommended</span>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleOthersUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300/50 bg-secondary px-6 py-3 font-medium text-gray-800 shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
          >
            <FiSend size={16} />
            Submit your photos
          </button>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {isSubmitted && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-black/40 p-0 backdrop-blur-md sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsSubmitted(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            className="relative max-h-[90dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-8 shadow-2xl animate-in slide-in-from-bottom duration-300 sm:max-h-[85dvh] sm:max-w-md sm:rounded-2xl sm:p-8 sm:animate-in sm:fade-in sm:zoom-in"
          >
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>

            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
              <FiCheckCircle size={38} />
            </div>

            <h3
              id="success-title"
              className="text-center text-xl font-bold text-gray-800 sm:text-2xl"
            >
              Submission Successful!
            </h3>

            <p className="mb-6 mt-3 text-center text-sm leading-relaxed text-gray-500">
              Apnar submit kora information ebong photos gulo shofolbhabe
              receive kora hoyeche.
            </p>

            <button
              type="button"
              onClick={resetForm}
              className="w-full rounded-lg border border-gray-300/60 bg-secondary py-3 font-semibold text-gray-800 transition hover:opacity-90"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionForm;
