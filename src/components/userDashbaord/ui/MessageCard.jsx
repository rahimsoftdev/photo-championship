import React from 'react';
import { useNavigate } from 'react-router';
import { FiHeart, FiShare2, FiCalendar, FiClock } from 'react-icons/fi';

const MessageCard = ({ item, post,userInfo }) => {
    const navigate = useNavigate();
    const {  userId, usrinfo, date, desciption, image, loves } = item || {};
    console.log(item)

    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : '';
    const formattedTime = date
        ? new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        : '';

    const isPost = post === 'yes';

    // Details page-e jawar id (item.id thakle seta, na hole userId)
    const itemId = userId;
    const goToDetails = () => {
        if (itemId) navigate(`/user-dashboard/news-message/${item.id || 897}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToDetails();
        }
    };

    // Button click korle card-er navigate jeno na hoy
    const stop = (e) => e.stopPropagation();

    return (
        <div
            role="link"
            tabIndex={0}
            onClick={goToDetails}
            onKeyDown={handleKeyDown}
            className="w-full min-w-0 bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
            <div className="min-w-0">
                {/* Top: User info + Badge (jayga na thakle badge nicher line-e jabe) */}
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 mb-3 sm:mb-4">
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1 basis-[190px]">
                        <img
                            src={userInfo?.id === item.userId && userInfo?.image || "https://i.pravatar.cc/150"}
                            alt={usrinfo?.name || "User"}
                            loading="lazy"
                            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full object-cover border border-gray-100 mt-0.5"
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 leading-snug truncate">
                                {usrinfo?.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-gray-400 mt-1">
                                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                    <FiCalendar size={12} className="shrink-0" />
                                    {formattedDate}
                                </span>
                                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                    <FiClock size={12} className="shrink-0" />
                                    {formattedTime}
                                </span>
                            </div>
                        </div>
                    </div>

                    <span className="shrink-0 bg-sky-50 text-sky-600 border border-sky-100 text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-md tracking-wider whitespace-nowrap">
                        PHOTOGRAPHER NOTE
                    </span>
                </div>

                {/* Description */}
                {desciption && (
                    <p className="text-gray-700 text-[13px] sm:text-sm leading-relaxed mb-3 sm:mb-4 break-words">
                        {desciption}
                    </p>
                )}

                {/* Image */}
                {image && (
                    <div className="mb-3 sm:mb-4 overflow-hidden rounded-lg sm:rounded-xl border border-gray-100">
                        <img
                            src={image}
                            alt="Post attachment"
                            loading="lazy"
                            className={`w-full object-cover hover:scale-105 transition duration-300 ${
                                isPost
                                    ? 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]'
                                    : 'h-40 sm:h-44 md:h-40 xl:h-44'
                            }`}
                        />
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <button
                    type="button"
                    onClick={stop}
                    className="flex items-center gap-1.5 py-1.5 pr-2 hover:text-rose-600 transition"
                >
                    <FiHeart className="text-rose-500 fill-rose-500" size={16} />
                    <span className="font-medium text-gray-700 whitespace-nowrap">{loves || 0} Likes</span>
                </button>
                <button
                    type="button"
                    onClick={stop}
                    className="flex items-center gap-1.5 py-1.5 pl-2 hover:text-gray-900 transition"
                >
                    <FiShare2 size={15} />
                    <span className="font-medium">Share</span>
                </button>
            </div>
        </div>
    );
};

export default MessageCard;