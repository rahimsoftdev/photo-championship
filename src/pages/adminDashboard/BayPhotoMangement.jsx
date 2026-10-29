// import { Pagination } from '@heroui/react';
import React, { useState } from 'react';
import LoadingPage from '../feedback/LoadingPage';
// import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
// import AdminArtworkCard from '../../components/admin/Adminartworkcard';
import { useSearchParams } from 'react-router';
import useArtwork from '../../hooks/useArtwork';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import AdminArtworkCard from '../../components/admin/Adminartworkcard';
import Pagination from '../../components/shared/Pagination';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';

const BayPhotoMangement = () => {
    const [searchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    // TODO: if useArtwork returns a filteredArtworks list, it is used below; otherwise it falls back to artworks
    const {
        artworks,
        filteredArtworks = artworks,
        totalPages,
        loading,
        error,
    } = useArtwork(params, true, 9, "/bayPhoto.json");
    console.log(artworks, 'paichi')

    // Ids of artworks the admin deleted (frontend only, so the card disappears from the grid)
    // TODO: remove this once real delete API + refetch is connected
    const [deletedIds, setDeletedIds] = useState([]);

    const handleDelete = (id) => {
        // TODO: call real delete API here
        setDeletedIds((prev) => [...prev, id]);
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    // Hide the ones already deleted (loading er somoy artworks undefined hole crash na kore)
    const visibleArtworks = (artworks || []).filter((art) => !deletedIds.includes(art.id));
    const visibleFilteredCount = (filteredArtworks || []).filter((art) => !deletedIds.includes(art.id)).length;

    return (
        <section className="w-full space-y-4">
             <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                        Bay Photos
                    </h1>
                </div>
            </div>

            {/* Filter Component */}
            <MyArtworkFilter
                totalShown={visibleArtworks.length}
                totalFiltered={visibleFilteredCount}
            />

            {/* loading hole skeleton ekhane dekhabe */}
            {loading ? (
                <ArtworkSkeleton />
            ) : visibleArtworks.length === 0 ? (
                <p>No photos found.</p>
            ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
                    {visibleArtworks.map((artWorkData) => (
                        <AdminArtworkCard
                            key={artWorkData.id}
                            imageData={artWorkData}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Pagination Component */}
            {!loading && <Pagination totalPages={totalPages} />}
        </section>
    );
};

export default BayPhotoMangement;