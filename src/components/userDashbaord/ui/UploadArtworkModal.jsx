import React from 'react';
import { useNavigate } from 'react-router';
import { FiImage, FiLayers, FiX } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const UploadArtworkModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    // Option click handler with dynamic query params
    const handleSelectOption = (albumType) => {
        navigate(`/userDashboard/sell-photos/new?albumType=${albumType}&bayphoto=yes`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
                >
                    <FiX size={18} />
                </button>

                {/* Header Title */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
                    SELECT ARTWORK FORMAT
                </h3>

                {/* Options List */}
                <div className="space-y-4">
                    
                    {/* Option 1: Single Photo */}
                    <div 
                        onClick={() => handleSelectOption('single')}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition cursor-pointer group shadow-xs"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            <FiImage size={22} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition">
                                Upload Single Photo
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Upload one high-resolution photograph
                            </p>
                        </div>
                    </div>

                    {/* Option 2: 6 Photos */}
                    <div 
                        onClick={() => handleSelectOption('six')}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition cursor-pointer group shadow-xs"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            <FiLayers size={22} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition">
                                Upload 6 Photos
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Create a cohesive 6-photo album story
                            </p>
                        </div>
                    </div>

                    {/* Option 3: 12 Photos */}
                    <div 
                        onClick={() => handleSelectOption('twelve')}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition cursor-pointer group shadow-xs"
                    >
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            <HiSparkles size={22} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition">
                                Upload 12 Photos
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Full Zodiac Story mapped to 12 signs
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UploadArtworkModal;