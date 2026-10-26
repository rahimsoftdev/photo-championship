import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import useArtwork from '../../hooks/useArtwork';
import Pagination from '../../components/shared/Pagination';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import UploadArtworkModal from '../../components/userDashbaord/ui/UploadArtworkModal';
import ArtworkCard from '../../components/ui/ArtworkCard';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';
import { FaPlus } from 'react-icons/fa6';
import { getSavedUserInfo } from '../../utils/getUserInof';
import useAllArtworks from '../../hooks/useAllArtworks';

const SellPhotosPage = () => {

        const [searchParams] = useSearchParams();
        const params = Object.fromEntries(searchParams.entries());
        const userInfo = getSavedUserInfo();
        const userId = userInfo?.id;

    // Modal state for upload format selection
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const {
        artworks = [],
        loading,
        error,
        totalPages = 1,
        totalFiltered = 0,
    } = useArtwork(params, true, 9, "/bayPhoto.json", userId);

    //     const {
    //     artworks,
    //     filteredArtworks,
    //     counts,
    //     totalPages,
    //     loading,
    //     error,
    // } = useAllArtworks(
    //     // userId sobar sheshe dewa hoyeche, jate URL er query param diye keu onno user er id override korte na pare
    //     { ...params, userId },
    //     12,
    //     '/bayPhoto.json'
    // );

    if (loading) return <ArtworkSkeleton />;
    if (error) {
        return (
            <div className="text-center py-12 sm:py-20 px-4 text-red-500 text-xs sm:text-sm break-words">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-full overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        Manage Your Selling Photos
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                        Manage your photos and showcase your work on your profile.
                    </p>
                </div>

                {/* Upload Photos Button */}
                <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="w-full sm:w-auto shrink-0 bg-secondary text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm cursor-pointer hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                    <span className="whitespace-nowrap">Upload Photos</span>
                    <FaPlus />
                </button>
            </div>

            {/* Filter */}
            <div className="mb-6 sm:mb-8 w-full min-w-0">
                <MyArtworkFilter totalShown={artworks.length} totalFiltered={totalFiltered || artworks.length} />
            </div>

            {/* Artwork Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-4 md:mb-8 ">
                {artworks.map((item) => (
                    <ArtworkCard
                        key={item.id}
                        artWorkData={item}
                        dashboard="yes"
                        currentUserId={userId}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center overflow-x-auto ">
                <Pagination totalPages={totalPages} />
            </div>

            {/* Upload Format Selection Modal Component */}
            <UploadArtworkModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
};

export default SellPhotosPage;