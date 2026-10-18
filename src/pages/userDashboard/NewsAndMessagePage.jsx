import React from 'react';
import { Link, useSearchParams } from 'react-router';
import { usePostOrNewsData } from '../../hooks/usePostOrNewsData';
import Pagination from '../../components/shared/Pagination';
import MessageCard from '../../components/userDashbaord/ui/MessageCard';
// import MessageCard from '../../components/MessageCard'; // Apnar path onujayi set korben

const NewsAndMessagePage = () => {
    const [searchParams] = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 6; // Image er layout onujayi 6 ta card

    const { paginatedData, totalPages, loading, error } = usePostOrNewsData(
        "/newsOrPost.json", 
        currentPage, 
        itemsPerPage
    );

    if (loading) return <div className="text-center py-12 text-gray-500">Loading messages...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Message</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your message and showcase your work on your profile.
                    </p>
                </div>
                <Link 
                    to="/userDashboard/news-message/new" 
                    className="bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:opacity-90 shadow-sm"
                >
                    Upload Message
                </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {paginatedData.map((item, index) => (
                    <MessageCard key={item.userId || index} item={item} />
                ))}
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} />
        </div>
    );
};

export default NewsAndMessagePage;