import React from 'react';
import { FiHeart, FiShare2, FiCalendar, FiClock } from 'react-icons/fi';

const MessageCard = ({ item,post }) => {
    const { usrinfo, date, desciption, image, loves } = item || {};

    // Date ebong Time formate korar jonno
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '';
    const formattedTime = date ? new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
                {/* Top User Info, Date/Time & Badge */}
                <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-start gap-3">
                        <img 
                            src={usrinfo?.avatar || "https://i.pravatar.cc/150"} 
                            alt={usrinfo?.name || "User"} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-100 mt-0.5"
                        />
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 leading-snug">{usrinfo?.name}</h3>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400 mt-1">
                                <span className="flex items-center gap-1">
                                    <FiCalendar size={12} className="text-gray-400" /> {formattedDate}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <FiClock size={12} className="text-gray-400" /> {formattedTime}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Photographer Note Badge (10px font size) */}
                    <span className="bg-sky-50 text-sky-600 border border-sky-100 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider whitespace-nowrap">
                        PHOTOGRAPHER NOTE
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {desciption}
                </p>

                {/* Image */}
                {image && (
                    <div className="mb-4 overflow-hidden rounded-xl border border-gray-100">
                        <img 
                            src={image} 
                            alt="Post attachment" 
                            className={`w-full  object-cover hover:scale-105 transition duration-300 ${post ==='yes' ? "h-100" : 'h-40'}`}
                        />
                    </div>
                )}
            </div>

            {/* Bottom Actions: Loves & Share */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                <button className="flex items-center gap-1.5 hover:text-rose-600 transition">
                    <FiHeart className="text-rose-500 fill-rose-500" size={16} />
                    <span className="font-medium text-gray-700">{loves || 0} Likes</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-gray-900 transition">
                    <FiShare2 size={15} />
                    <span className="font-medium">Share</span>
                </button>
            </div>
        </div>
    );
};

export default MessageCard;