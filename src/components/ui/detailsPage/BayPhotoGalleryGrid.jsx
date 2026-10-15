import React, { useState } from 'react';
import { FaHeart, FaShareAlt, FaShoppingCart } from 'react-icons/fa';

const BayPhotoGalleryGrid = ({ images, zodiacs, bayPhoto }) => {
    // State for interactive features
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(bayPhoto?.totalReact || 2150);
    const [copied, setCopied] = useState(false);

    // Handle Like Toggle
    const handleLikeToggle = () => {
        if (isLiked) {
            setIsLiked(false);
            setLikesCount(prev => prev - 1);
        } else {
            setIsLiked(true);
            setLikesCount(prev => prev + 1);
        }
    };

    // Handle Share (Copy Full URL)
    const handleShare = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            alert("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="w-full my-6 space-y-6">
            
            {/* Top Badges / Tags */}
            <div className="flex flex-wrap items-center gap-3">
                {bayPhoto?.albumType && (
                    <span className="bg-[#E0E7FF] text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {bayPhoto.albumType} Album • {bayPhoto.images?.length || 1} Photos
                    </span>
                )}
                {bayPhoto?.category && (
                    <span className="bg-[#E0E7FF] text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {bayPhoto.category}
                    </span>
                )}
                {zodiacs && zodiacs.map((zodiac, index) => (
                    <span key={index} className="bg-[#E0E7FF] text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        Zodiac: {zodiac}
                    </span>
                ))}
            </div>

            {/* Main 3 Columns Grid Section matching the design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1st Column: Title & Price Card */}
                <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-[#111827] mb-2 leading-snug">
                            {bayPhoto?.title || "Chasing the Neon Stream"}
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            {bayPhoto?.description || "High-Resolution Digital Download"}
                        </p>
                    </div>
                    <div>
                        <div className="text-2xl lg:text-3xl font-bold text-[#111827] mb-4">
                            $25.00
                        </div>
                        <button className="w-full bg-secondary text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md">
                            <FaShoppingCart /> Buy Photo
                        </button>
                    </div>
                </div>

                {/* 2nd Column: Creator Card */}
                <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <h3 className="text-lg font-semibold text-[#111827] pb-3 border-b border-[#C6C6CD] mb-6">
                            Creator
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <img 
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                                alt="Creator" 
                                className="w-12 h-12 rounded-full object-cover border border-[#C6C6CD]"
                            />
                            <div>
                                <h4 className="font-bold text-[#111827]">
                                    {bayPhoto?.info?.author || "Emma Wilson"}
                                </h4>
                                <p className="text-xs text-gray-500">Professional Landscape Photographer</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full border border-[#C6C6CD] text-[#111827] py-2.5 rounded-xl font-medium hover:bg-[#F5F5F5] transition-all">
                        View Profile
                    </button>
                </div>

                {/* 3rd Column: Image Details */}
                <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 shadow-sm md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-[#111827] pb-3 border-b border-[#C6C6CD] mb-4">
                        Image Details
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Credit:</span>
                            <span className="text-primary font-medium">{bayPhoto?.info?.author || "Wong kar-wai"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Creative #:</span>
                            <span className="text-[#111827] font-medium">2278500954</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Resolution:</span>
                            <span className="text-[#111827] font-medium">
                                {bayPhoto?.imageDetails?.width || 1200}×{bayPhoto?.imageDetails?.height || 800}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Quality:</span>
                            <span className="text-primary font-medium">4K</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">File Type:</span>
                            <span className="text-[#111827] font-medium uppercase">{bayPhoto?.imageDetails?.format || "JPEG"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">File size:</span>
                            <span className="text-[#111827] font-medium">{bayPhoto?.imageDetails?.size || "125 KB"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Upload date:</span>
                            <span className="text-[#111827] font-medium">01 June, 2026</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Categories:</span>
                            <span className="text-[#111827] font-medium capitalize">{bayPhoto?.category || "Stock Photos"}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Stats Row Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F5F5F5] border border-[#C6C6CD] rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">TOTAL REACT</p>
                    <h3 className="text-2xl font-bold text-[#111827]">{likesCount}</h3>
                </div>
                <div className="bg-[#F5F5F5] border border-[#C6C6CD] rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-1">VIEWS COUNTED</p>
                    <h3 className="text-2xl font-bold text-[#111827]">{bayPhoto?.viewsCount || 12400}</h3>
                </div>
            </div>

            {/* Action Buttons: Like & Share */}
            <div className="flex items-center gap-4 pt-2">
                {/* Like Button with Toggle Background */}
                <button 
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
                        isLiked 
                            ? 'bg-secondary text-white' 
                            : 'bg-[#FDE8E9] text-secondary border border-secondary/30 hover:bg-secondary/10'
                    }`}
                >
                    <FaHeart className={isLiked ? 'text-white' : 'text-secondary'} />
                    <span>Like</span>
                </button>

                {/* Share Button to Copy Link */}
                <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-medium bg-[#FDE8E9] text-secondary border border-secondary/30 hover:bg-secondary/10 transition-all shadow-sm"
                >
                    <FaShareAlt />
                    <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
            </div>

        </div>
    );
};

export default BayPhotoGalleryGrid;