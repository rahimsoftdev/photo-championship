import React from 'react';
import { useSearchParams } from 'react-router';
import useArtwork from '../../hooks/useArtwork';
import LoadingPage from '../feedback/LoadingPage';
import ArtworkCard from '../../components/ui/ArtworkCard';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
// import { Pagination } from '@heroui/react';
import { FaImage } from 'react-icons/fa';
import Pagination from '../../components/shared/Pagination';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';

const BayPhotoTab = () => {

    const [searchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    const {
        artworks,
        totalArtworks,
        totalPages,
        loading,
        error,
    } = useArtwork(params, true, 9, "/bayPhoto.json");
    console.log(artworks, 'paichi')

    if (loading) {
        return <ArtworkSkeleton />
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }
    return (
        <div className='space-y-6'>
            <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span><FaImage className="text-2xl " /></span> My Artwork
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    Explore single photography prints, 6-photo sets, and 12-photo Zodiac Story editorial albums
                </p>
            </div>


            <MyArtworkFilter totalShown={artworks.length}
                totalFiltered={totalArtworks} />

            <section className="w-full space-y-6 mt-5">


                {artworks.length === 0 ? (
                    <p>No photos found.</p>
                ) : (
                    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
                        {artworks.map((artWorkData) => (
                            <ArtworkCard
                                key={artWorkData.id}
                                artWorkData={artWorkData}
                            />
                        ))}
                    </div>
                )}
            </section>

            <Pagination totalPages={totalPages} />

        </div>
    );
};

export default BayPhotoTab;