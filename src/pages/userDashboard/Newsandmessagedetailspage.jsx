import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { FiArrowLeft, FiCalendar, FiClock, FiHeart, FiMail, FiShare2 } from 'react-icons/fi';
import { usePostOrNewsDetails } from '../../hooks/usePostOrNewsDetails';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';
import { getSavedUserInfo } from '../../utils/getUserInof';
import ArtworkDetailsSkeleton from '../../components/ui/Skeletons/ArtworkDetailsSkeleton';

const BACK_PATH = '/user-dashboard/news-message';

const NewsAndMessageDetailsPage = () => {
    const { id } = useParams(); // route: /user-dashboard/news-message/:id
    const { details, loading, error, notFound } = usePostOrNewsDetails("/newsOrPost.json", id);
    const [copied, setCopied] = useState(false);
    const userInfo = getSavedUserInfo()


    if (loading) return <ArtworkDetailsSkeleton/>

    if (error) {
        return (
            <div className="text-center py-10 sm:py-12 px-4 text-sm sm:text-base text-red-500 break-words">
                Error: {error}
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="w-full text-center py-12 sm:py-16 px-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Message not found</h2>
                <p className="text-sm text-gray-500 mt-2 break-words">
                    No message exists with id "{id}".
                </p>
                <Link
                    to={BACK_PATH}
                    className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-secondary text-white text-sm font-semibold hover:opacity-90 transition"
                >
                    <FiArrowLeft size={16} /> Back to messages
                </Link>
            </div>
        );
    }

    const { usrinfo, date, desciption, image, loves } = details;

    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : '';
    const formattedTime = date
        ? new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        : '';

    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: usrinfo?.name || 'Message', text: desciption, url });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            // user share cancel korle kichu korar dorkar nei
        }
    };

    return (
        <div className="w-full  overflow-x-hidden">
            {/* Back link */}
            <Link
                to={BACK_PATH}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-4 sm:mb-6"
            >
                <FiArrowLeft size={16} />
                Back to messages
            </Link>

            <article className=" bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
                {/* Top: User info + Badge */}
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-3 mb-4 sm:mb-6">
                    <div className="flex items-start gap-3 min-w-0 flex-1 basis-[220px]">
                        <img
                            src={userInfo?.image || "https://i.pravatar.cc/150"}
                            alt={userInfo?.name || "User"}
                            className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full object-cover border border-gray-100"
                        />
                        <div className="min-w-0 flex-1">
                            <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug break-words">
                                {userInfo?.name}
                            </h1>
                            {userInfo?.email && (
                                <p className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-0.5 min-w-0">
                                    <FiMail size={13} className="shrink-0" />
                                    <span className="truncate">{usrinfo.email}</span>
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-gray-400 mt-1.5">
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
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 break-words">
                        {desciption}
                    </p>
                )}

                {/* Image */}
                {image && (
                    <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50">
                        <img
                            src={image}
                            alt="Post attachment"
                            className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] object-cover"
                        />
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
                    <button
                        type="button"
                        className="flex items-center gap-1.5 py-1.5 pr-2 hover:text-rose-600 transition"
                    >
                        <FiHeart className="text-rose-500 fill-rose-500" size={18} />
                        <span className="font-medium text-gray-700 whitespace-nowrap">{loves || 0} Likes</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-1.5 py-1.5 pl-2 hover:text-gray-900 transition"
                    >
                        <FiShare2 size={16} />
                        <span className="font-medium">{copied ? 'Link copied!' : 'Share'}</span>
                    </button>
                </div>
            </article>
        </div>
    );
};

export default NewsAndMessageDetailsPage;