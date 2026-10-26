import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { FiMoreVertical, FiEdit2, FiTrash2, FiX, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const DETAILS_BASE_PATH = '/user-dashboard/my-store';

/* ------------------------------------------------------------------
   Reusable Modal
   - body-te render hoy (portal), tai sidebar/header shob kichu blur hoy
   - modal open thakle baire-r page scroll hoy na
   - Esc chaple ba bahire click korle bondho hoy
------------------------------------------------------------------- */
const Modal = ({ onClose, panelClassName = 'max-w-lg', children }) => {
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // Scrollbar gayeb hole layout jeno na lafay
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-4 bg-black/50 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto w-full ${panelClassName} bg-white rounded-2xl shadow-2xl`}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

const ProductCard = ({ product, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editFormData, setEditFormData] = useState(product);
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });
  const menuRef = useRef(null);

  // Click outside to close dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Card click -> details page
  const goToDetails = () => {
    if (product?.id !== undefined && product?.id !== null) {
      navigate(`${DETAILS_BASE_PATH}/${product.id}`);
    }
  };

  const handleCardKeyDown = (e) => {
    if (e.target !== e.currentTarget) return; // bhetore-r button-er key ignore
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToDetails();
    }
  };

  // Edit modal open (latest data diye form bhora)
  const openEdit = () => {
    setEditFormData(product);
    setIsEditing(true);
    setShowMenu(false);
  };

  // Handle Edit Submit with Success Feedback
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onEdit) onEdit(editFormData);
    setIsEditing(false);
    setShowMenu(false);

    setFeedback({
      show: true,
      type: 'edit',
      message: 'Product updated successfully!',
    });
  };

  // Delete confirmation modal open
  const openDeleteConfirm = () => {
    setShowMenu(false);
    setIsConfirmingDelete(true);
  };

  // Confirm delete -> success feedback dekhabe
  // (card list theke soriye jawar age feedback dekhano-r jonno data delete OK/close-er shomoy hoy)
  const handleConfirmDelete = () => {
    setIsConfirmingDelete(false);
    setFeedback({
      show: true,
      type: 'delete',
      message: 'Product deleted successfully!',
    });
  };

  const closeFeedback = () => {
    const wasDelete = feedback.type === 'delete';
    setFeedback({ show: false, type: '', message: '' });
    if (wasDelete && onDelete) onDelete(product.id);
  };

  return (
    <>
      <div
        role="link"
        tabIndex={0}
        onClick={goToDetails}
        onKeyDown={handleCardKeyDown}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 h-full"
      >
        {/* Card Image Header */}
        <div className="relative h-40 sm:h-44 lg:h-48 xl:h-52 w-full bg-gray-100">
          <img
            src={product.bannerImage}
            alt={product.collectionTitle}
            loading="lazy"
            className="w-full h-full object-cover"
          />

          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 max-w-[60%] truncate bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-2 sm:px-2.5 py-1 rounded-md uppercase tracking-wider">
            {product.category}
          </span>

          {/* 3-Dot Menu Button (click korle card navigate hobe na) */}
          <div
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setShowMenu((prev) => !prev)}
              className="bg-black/60 backdrop-blur-md text-white p-1.5 sm:p-2 rounded-full hover:bg-black/80 transition cursor-pointer"
            >
              <FiMoreVertical size={14} />
            </button>

            {/* Dropdown Options (Edit & Delete) */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 overflow-hidden">
                <button
                  type="button"
                  onClick={openEdit}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                >
                  <FiEdit2 size={13} /> Edit
                </button>
                <button
                  type="button"
                  onClick={openDeleteConfirm}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 cursor-pointer"
                >
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5 line-clamp-1">
            {product.collectionTitle}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-3 sm:mb-4 line-clamp-2 break-words">
            {product.description}
          </p>

          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-sm sm:text-base">
              {product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <Modal onClose={() => setIsEditing(false)} panelClassName="max-w-lg">
          <div className="p-4 sm:p-6">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 pr-8">Edit Product</h3>

            <form onSubmit={handleEditSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-500 uppercase mb-1">Collection Title</label>
                <input
                  type="text"
                  value={editFormData.collectionTitle || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, collectionTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFF] rounded-lg text-sm border outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                <input
                  type="text"
                  value={editFormData.price ?? ''}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFF] rounded-lg text-sm border outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFF] rounded-lg text-sm border outline-none resize-none focus:border-gray-400"
                  required
                ></textarea>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 sm:py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 sm:py-2 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <Modal onClose={() => setIsConfirmingDelete(false)} panelClassName="max-w-sm">
          <div className="p-5 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-red-100 text-red-500">
              <FiAlertTriangle size={28} />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Delete product?</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-5 break-words">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-800">{product.collectionTitle}</span>? This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-xs font-medium hover:bg-red-600 transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Feedback Modal for Edit / Delete */}
      {feedback.show && (
        <Modal onClose={closeFeedback} panelClassName="max-w-sm">
          <div className="p-5 sm:p-6 text-center">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                feedback.type === 'delete' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'
              }`}
            >
              <FiCheckCircle size={30} />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              {feedback.type === 'delete' ? 'Deleted!' : 'Updated!'}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-5">{feedback.message}</p>

            <button
              type="button"
              onClick={closeFeedback}
              className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-xl text-xs hover:bg-black transition cursor-pointer"
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProductCard;