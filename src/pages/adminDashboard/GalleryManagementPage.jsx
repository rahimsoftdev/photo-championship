// import { Pagination } from '@heroui/react';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router';
import LoadingPage from '../feedback/LoadingPage';
// import AdminArtworkCard from '../../components/ui/AdminArtworkCard';
// import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import useArtwork from '../../hooks/useArtwork';
import AdminArtworkCard from '../../components/admin/Adminartworkcard';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import Pagination from '../../components/shared/Pagination';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';

const GalleryManagementPage = () => {
    // Read query params from the current URL.
    const [searchParams] = useSearchParams();

    // Convert URL query params into an object for the custom hook.
    const params = Object.fromEntries(searchParams.entries());

    // Get filtered and paginated competition artworks.
    // TODO: if useArtwork returns a filteredArtworks list, it is used below; otherwise it falls back to artworks
    const {
        artworks,
        filteredArtworks = artworks,
        loading,
        error,
        totalPages,
    } = useArtwork(params, false, 9, '/artWork.json');

    // Ids of artworks the admin deleted (frontend only, so the card disappears from the grid)
    // TODO: remove this once real delete API + refetch is connected
    const [deletedIds, setDeletedIds] = useState([]);

    const handleDelete = (id) => {
        // TODO: call real delete API here
        setDeletedIds((prev) => [...prev, id]);
    };

    // Show an error if fetching fails.
    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    // Hide the ones already deleted (loading er somoy artworks undefined hole crash na kore)
    const visibleArtworks = (artworks || []).filter((art) => !deletedIds.includes(art.id));
    const visibleFilteredCount = (filteredArtworks || []).filter((art) => !deletedIds.includes(art.id)).length;

    return (
        <section className="w-full space-y-4">
            {/* Filter Component */}

             <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                        Gallery
                    </h1>
                </div>
            </div>
            <MyArtworkFilter
                totalShown={visibleArtworks.length}
                totalFiltered={visibleFilteredCount}
            />

            {/* Artwork cards (loading hole skeleton ekhane dekhabe) */}
            {loading ? (
                <ArtworkSkeleton />
            ) : (
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
                    {visibleArtworks.map((artWorkData) => (
                        <AdminArtworkCard
                            key={
                                artWorkData.id ??
                                artWorkData._id ??
                                `${artWorkData.userId}-${artWorkData.title}`
                            }
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

export default GalleryManagementPage;