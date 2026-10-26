import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { usePostOrNewsData } from '../../hooks/usePostOrNewsData';
import Pagination from '../../components/shared/Pagination';
import MessageCard from '../../components/userDashbaord/ui/MessageCard';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';
import { FiPlus } from 'react-icons/fi';
import { getSavedUserInfo } from '../../utils/getUserInof';

const NewsAndMessagePage = () => {
    const [searchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 6;
    const userInfo = getSavedUserInfo()
    const userId = userInfo.id

    const { paginatedData, totalPages, loading, error } = usePostOrNewsData(
        "/newsOrPost.json",
        currentPage,
        itemsPerPage,
        userId
    );

    if (loading) return <ArtworkSkeleton />;
    if (error) {
        return (
            <div className="text-center py-10 sm:py-12 px-4 text-sm sm:text-base text-red-500 break-words">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        My Message
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
                        Manage your message and showcase your work on your profile.
                    </p>
                </div>

                <Link
                    to="/user-dashboard/news-message/new"
                    className="w-full sm:w-auto shrink-0 bg-secondary text-white inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-90 shadow-sm"
                >
                    <FiPlus size={16} />
                    <span className="whitespace-nowrap">Upload Message</span>
                </Link>
            </div>

            {/* Cards Grid */}
            {paginatedData?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
                    {paginatedData.map((item, index) => (
                        <MessageCard key={item.id || item.userId || index} item={item} userInfo={userInfo} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-sm text-gray-500">
                    No messages found.
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center overflow-x-auto pb-2">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
};

export default NewsAndMessagePage;