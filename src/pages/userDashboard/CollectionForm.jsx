import React, { useState } from 'react';
import { 
  FiUploadCloud, 
  FiChevronDown, 
  FiX, 
  FiCheckCircle, 
  FiSend 
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

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Banner image handler
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
    }
  };

  // Others images handler
  const handleOthersUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setOtherImages((prev) => [...prev, ...newImages]);
  };

  // Remove uploaded images
  const removeBannerImage = () => setBannerImage(null);
  const removeOtherImage = (index) => {
    setOtherImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#ECEDFA] p-4 md:p-10 flex justify-center items-center font-sans">
      <div className="w-full max-w-5xl bg-[#ECEDFA] rounded-2xl p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* COLLECTION TITLE */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              COLLECTION TITLE
            </label>
            <input
              type="text"
              name="collectionTitle"
              value={formData.collectionTitle}
              onChange={handleInputChange}
              placeholder="e.g., Celestial Archetypes of Fire"
              required
              className="w-full px-4 py-3 bg-[#FAFAFF] rounded-lg text-gray-700 placeholder-gray-400 outline-none text-sm border-none shadow-sm"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              CATEGORY
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#FAFAFF] rounded-lg text-gray-700 outline-none text-sm appearance-none cursor-pointer border-none shadow-sm"
              >
                <option value="Astrophotography">Astrophotography</option>
                <option value="Nature">Nature</option>
                <option value="Portrait">Portrait</option>
                <option value="Digital Art">Digital Art</option>
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
            </div>
          </div>

          {/* PRICE */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="$2.00"
              required
              className="w-full px-4 py-3 bg-[#FAFAFF] rounded-lg text-gray-700 placeholder-gray-400 outline-none text-sm border-none shadow-sm"
            />
          </div>

          {/* SET EDITION/SIZE */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              Set Edition/Size
            </label>
            <input
              type="text"
              name="editionSize"
              value={formData.editionSize}
              onChange={handleInputChange}
              placeholder="write edition or size"
              required
              className="w-full px-4 py-3 bg-[#FAFAFF] rounded-lg text-gray-700 placeholder-gray-400 outline-none text-sm border-none shadow-sm"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write Description about this product"
              required
              className="w-full px-4 py-3 bg-[#FAFAFF] rounded-lg text-gray-700 placeholder-gray-400 outline-none text-sm resize-none border-none shadow-sm"
            ></textarea>
          </div>

          {/* PRODUCT BANNER IMAGE */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              Product Banner Image
            </label>
            <div className="border border-dashed border-gray-300 rounded-lg bg-white p-6 flex flex-col items-center justify-center text-center min-h-[150px]">
              {bannerImage ? (
                <div className="relative w-full max-w-xs h-32 group">
                  <img
                    src={bannerImage.preview}
                    alt="Banner preview"
                    className="w-full h-full object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={removeBannerImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center w-full">
                  <div className="bg-[#EAEBF8] text-slate-700 p-2.5 rounded-full mb-2">
                    <FiUploadCloud size={20} />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    Drag and drop photos here
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Or click to browse from your computer
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-2">
                    <span>JPEG, PNG</span>
                    <span>•</span>
                    <span>Max 1 photos</span>
                    <span>•</span>
                    <span>1920×1080px recommended</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* OTHERS IMAGES */}
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              Others Images
            </label>
            <div className="border border-dashed border-gray-300 rounded-lg bg-white p-6 flex flex-col items-center justify-center text-center min-h-[150px]">
              {otherImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4 justify-center">
                  {otherImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 group">
                      <img
                        src={img.preview}
                        alt={`Other ${idx}`}
                        className="w-full h-full object-cover rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeOtherImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="cursor-pointer flex flex-col items-center w-full">
                <div className="bg-[#EAEBF8] text-slate-700 p-2.5 rounded-full mb-2">
                  <FiUploadCloud size={20} />
                </div>
                <p className="text-xs font-bold text-gray-800">
                  Drag and drop photos here
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Or click to browse from your computer
                </p>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-2">
                  <span>JPEG, PNG</span>
                  <span>•</span>
                  <span>1920×1080px recommended</span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleOthersUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* SUBMIT BUTTON WITH BG-SECONDARY */}
          <button
            type="submit"
            className="w-full bg-secondary text-gray-800 font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-[0.99] border border-gray-300/50"
          >
            <FiSend size={16} />
            Submit your photos
          </button>
        </form>
      </div>

      {/* BEAUTIFUL SUCCESSFUL FEEDBACK MODAL */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsSubmitted(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <FiX size={20} />
            </button>

            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle size={38} />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Submission Successful!
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Apnar submit kora information ebong photos gulo shofolbhabe receive kora hoyeche.
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  collectionTitle: '',
                  category: 'Astrophotography',
                  price: '',
                  editionSize: '',
                  description: '',
                });
                setBannerImage(null);
                setOtherImages([]);
              }}
              className="w-full bg-secondary text-gray-800 font-semibold py-3 rounded-lg hover:opacity-90 transition border border-gray-300/60"
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