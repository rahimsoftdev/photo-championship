import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { usePostOrNewsData } from '../../hooks/usePostOrNewsData';
import MessageCard from '../../components/userDashbaord/ui/MessageCard';
import Pagination from '../../components/shared/Pagination';

const PostTab = () => {
    const [searchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 6; // Image er layout onujayi 6 ta card

    const { paginatedData, totalPages, loading, error } = usePostOrNewsData(
        "/newsOrPost.json",
        currentPage,
        itemsPerPage
    );
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Photographer announcements, behind-the-scenes logs, and exhibition news
                    </p>
                </div>
             
            </div>

            {/* Cards Grid */}
            <div className=" space-y-4 mb-10">
                {paginatedData.map((item, index) => (
                    <MessageCard post={'yes'} key={item.userId || index} item={item} />
                ))}
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} />
        </div>
    );
};

export default PostTab;