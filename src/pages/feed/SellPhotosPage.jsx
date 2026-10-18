import React from 'react';
import { useSearchParams } from 'react-router';
import useArtwork from '../../hooks/useArtwork';
import Pagination from '../../components/shared/Pagination';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import ArtworkCard from '../../components/userDashbaord/ArtworkCard';
// import ArtworkCard from '../../components/ArtworkCard'; // Apnar path onujayi

const SellPhotosPage = () => {
    const [searchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    const {
        artworks = [],
        loading,
        error,
        totalPages = 1,
        totalFiltered = 0,
    } = useArtwork(params, true, 9, "/bayPhoto.json");

    if (loading) return <div className="text-center py-20 text-gray-500 text-sm">Loading photos...</div>;
    if (error) return <div className="text-center py-20 text-red-500 text-sm">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Your Selling Photos</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your photos and showcase your work on your profile.</p>
                </div>
                <button type="button" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm">
                    Upload Photos
                </button>
            </div>

            <div className="mb-8">
                <MyArtworkFilter totalShown={artworks.length} totalFiltered={totalFiltered || artworks.length} />
            </div>

            {/* Artwork Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {artworks.map((item) => (
                    <ArtworkCard key={item.id} item={item} />
                ))}
            </div>

            <Pagination totalPages={totalPages} />
        </div>
    );
};

export default SellPhotosPage;