import React from 'react';
import { useParams, useOutletContext, useSearchParams } from 'react-router';
import useArtwork from '../../hooks/useArtwork'; // তোমার হুকের সঠিক পাথ
import { FaImage, FaSpinner } from 'react-icons/fa';
import CompetitionBannerCarousel from '../../components/profile/CompetitionBannerCarousel';
import ArtworkCard from '../../components/ui/ArtworkCard';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import Pagination from '../../components/shared/Pagination';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';
import NoPhotosFound from '../../components/ui/NoPhotosFound';

const ArtworksTab = () => {
    const { id } = useParams();
    const { user } = useOutletContext();

    // URL থেকে search params রিড করা
    const [searchParams] = useSearchParams();
    const albumType = searchParams.get('albumType') || '';
    const page = Number(searchParams.get('page')) || 1;

    // তোমার হুকের প্যারামিটার স্ট্রাকচার অনুযায়ী কল করা হলো:
    // hook({ queryParamsObject }, competitionBoolean, itemsPerPage, url)
    const {
        artworks,
        totalArtworks,
        totalPages,
        loading,
        error,
    } = useArtwork(
        { albumType, page }, // প্রথম প্যারামিটার (destructured object)
        true,                // competition = true
        8,                   // itemsPerPage = 8
        '/artWork.json'      // url
    );

    if (loading) {
        return <ArtworkSkeleton />
    }

    if (error) {
        return (
            <div className="text-red-500 text-center py-6 bg-red-50 rounded-xl my-4">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 ">
            {/* 1. Top Carousel Component */}
            <CompetitionBannerCarousel />

            {/* 2. Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span><FaImage className="text-2xl " /></span> My Artwork
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Explore single photography prints, 6-photo sets, and 12-photo Zodiac Story editorial albums
                    </p>
                </div>

                {/* Sort Dropdown */}
                {/* <div className="flex items-center gap-2 self-start sm:self-center">
                    <select className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 outline-none cursor-pointer">
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div> */}
            </div>

            {/* Album Type Filter Component */}
            <MyArtworkFilter
                totalShown={artworks.length}
                totalFiltered={totalArtworks}
            />

            {/* 3. Artworks Grid */}
            {artworks.length === 0 ? (
                <NoPhotosFound />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {artworks.map((artwork) => (
                        <ArtworkCard key={artwork.id} artWorkData={artwork} />
                    ))}
                </div>
            )}

            {/* Pagination Component */}
            <div className="">
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    );
};

export default ArtworksTab;