import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiHeart, FiEye, FiCalendar, FiX } from 'react-icons/fi';
import ArtworkDropdownMenu from './ArtworkDropdownMenu';

const ArtworkCard = ({ item, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const [artworkData, setArtworkData] = useState(item);
    const [isDeleted, setIsDeleted] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Modals state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

    // Edit form state (ager value diye initialize kora)
    const [editForm, setEditForm] = useState({
        title: item.title || '',
        price: item.price || 0,
        description: item.description || '',
    });

    // Promote selected plan
    const [selectedPlan, setSelectedPlan] = useState(40);

    // Handle Image Click for Dynamic Routing
    const handleImageClick = () => {
        if (item?.id) {
            navigate(`/userDashboard/sell-photos/${item.id}`);
        }
    };

    // Handle Delete
    const handleDelete = () => {
        setIsDeleted(true);
        setSuccessMsg("Photo deleted successfully!");
        if (onDeleteSuccess) onDeleteSuccess(item.id);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    // Handle Edit Submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        setArtworkData(prev => ({ ...prev, ...editForm }));
        setIsEditModalOpen(false);
        setSuccessMsg("Photo updated successfully!");
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    if (isDeleted) return null; // Delete hole card render hobena

    const mainImage = artworkData.images?.[0] || "https://picsum.photos/1200/800";
    const formattedDate = artworkData.info?.createdAt 
        ? new Date(artworkData.info.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
        : 'August 9, 2026';

    return (
        <>
            {/* Success Toast Feedback */}
            {successMsg && (
                <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all animate-bounce">
                    {successMsg}
                </div>
            )}

            {/* Card UI */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between relative">
                <div>
                    {/* Image Container with Dynamic Click Routing */}
                    <div 
                        role="button"
                        tabIndex={0}
                        onClick={handleImageClick}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleImageClick();
                            }
                        }}
                        className="relative w-full h-56 rounded-xl overflow-hidden mb-4 bg-gray-100 cursor-pointer group"
                    >
                        <img 
                            src={mainImage} 
                            alt={artworkData.title} 
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
                        />
                        
                        {/* Top Left Badge */}
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                {artworkData.albumType === 'single' ? 'Single Photo' : artworkData.albumType === 'six' ? '6 Photo story' : '12 Photos - Full Zodiac Story'}
                            </span>
                        </div>

                        {/* 3-Dot Dropdown Menu (stopPropagation jate image click trigger na hoy) */}
                        <div 
                            className="absolute top-3 right-3" 
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        >
                            <ArtworkDropdownMenu
                                onEdit={() => setIsEditModalOpen(true)}
                                onDelete={handleDelete}
                                onPromote={() => setIsPromoteModalOpen(true)}
                            />
                        </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-2 truncate">{artworkData.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5"><FiHeart className="text-rose-500 fill-rose-500" size={14} /> {artworkData.totalReact || 0}</span>
                        <span className="flex items-center gap-1.5"><FiEye size={14} /> {artworkData.viewsCount || 0}</span>
                        <span className="flex items-center gap-1.5"><FiCalendar size={14} /> {formattedDate}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900">${Number(artworkData.price).toFixed(2)}</span>
                </div>
            </div>

            {/* --- EDIT MODAL --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                            <FiX size={20} />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Artwork</h3>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    value={editForm.title} 
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
                                <input 
                                    type="number" 
                                    value={editForm.price} 
                                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                                <textarea 
                                    rows={3} 
                                    value={editForm.description} 
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 cursor-pointer">Cancel</button>
                                <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 cursor-pointer">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- SPONSORED PHOTO (PROMOTE) MODAL --- */}
            {isPromoteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Sponsored Photo</h3>
                            <button onClick={() => setIsPromoteModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer">
                                <FiX size={16} />
                            </button>
                        </div>

                        <p className="text-xs font-semibold text-gray-800 mb-3">Price</p>

                        <div className="space-y-3 mb-6">
                            {[
                                { price: 40, days: 7 },
                                { price: 60, days: 15 },
                                { price: 100, days: 30 },
                            ].map((plan) => (
                                <div 
                                    key={plan.price}
                                    onClick={() => setSelectedPlan(plan.price)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                                        selectedPlan === plan.price ? 'border-red-500 bg-red-50/40' : 'border-gray-200 bg-red-50/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPlan === plan.price ? 'border-red-600' : 'border-gray-400'}`}>
                                            {selectedPlan === plan.price && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900">${plan.price}</p>
                                            <p className="text-xs text-gray-500">For {plan.days} days</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            type="button"
                            onClick={() => {
                                setIsPromoteModalOpen(false);
                                setSuccessMsg("Photo promoted successfully!");
                                setTimeout(() => setSuccessMsg(''), 3000);
                            }}
                            className="w-full bg-secondary text-white py-3 rounded-xl font-semibold text-sm transition hover:opacity-95 shadow-sm cursor-pointer"
                        >
                            Confirm Promotion
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArtworkCard;