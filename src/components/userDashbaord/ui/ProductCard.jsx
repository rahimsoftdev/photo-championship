import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiX, FiCheckCircle } from 'react-icons/fi';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  // Handle Edit Submit with Success Feedback
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (onEdit) onEdit(editFormData);
    setIsEditing(false);
    setShowMenu(false);
    
    // Show Edit Success Feedback
    setFeedback({
      show: true,
      type: 'edit',
      message: 'Product updated successfully!'
    });
  };

  // Handle Delete with Success Feedback
  const handleDeleteClick = () => {
    setShowMenu(false);
    if (onDelete) onDelete(product.id);

    // Show Delete Success Feedback
    setFeedback({
      show: true,
      type: 'delete',
      message: 'Product deleted successfully!'
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md relative">
        {/* Card Image Header */}
        <div className="relative h-52 w-full bg-gray-100">
          <img 
            src={product.bannerImage} 
            alt={product.collectionTitle}
            className="w-full h-full object-cover" 
          />
          
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {product.category}
          </span>

          {/* 3-Dot Menu Button */}
          <div className="absolute top-3 right-3" ref={menuRef}>
            <button 
              onClick={() => setShowMenu((prev) => !prev)}
              className="bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full hover:bg-black/80 transition cursor-pointer"
            >
              <FiMoreVertical size={14} />
            </button>

            {/* Dropdown Options (Edit & Delete) */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 overflow-hidden">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                >
                  <FiEdit2 size={13} /> Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50 cursor-pointer"
                >
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 text-sm mb-1.5 line-clamp-1">
            {product.collectionTitle}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-base">
              {product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
            >
              <FiX size={20} />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Product</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Collection Title</label>
                <input
                  type="text"
                  value={editFormData.collectionTitle}
                  onChange={(e) => setEditFormData({...editFormData, collectionTitle: e.target.value})}
                  className="w-full px-3 py-2 bg-[#FAFAFF] rounded-lg text-sm border outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price</label>
                <input
                  type="text"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                  className="w-full px-3 py-2 bg-[#FAFAFF] rounded-lg text-sm border outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-[#FAFAFF] rounded-lg text-sm border outline-none"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Feedback Modal for Edit / Delete */}
      {feedback.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
              feedback.type === 'delete' ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-500'
            }`}>
              <FiCheckCircle size={32} />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {feedback.type === 'delete' ? 'Deleted!' : 'Updated!'}
            </h3>
            <p className="text-gray-500 text-xs mb-5">
              {feedback.message}
            </p>

            <button
              onClick={() => setFeedback({ show: false, type: '', message: '' })}
              className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-xl text-xs hover:bg-black transition cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;