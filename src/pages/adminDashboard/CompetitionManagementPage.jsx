import React, { useState } from 'react';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import { useSearchParams } from 'react-router';
import useAllArtworks from '../../hooks/useAllArtworks';
import AdminArtworkCard from '../../components/admin/Adminartworkcard';
import Pagination from '../../components/shared/Pagination';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton';

const CompetitionManagementPage = () => {
    const [searchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    const {
        artworks,
        filteredArtworks,
        totalPages,
        loading,
        error,
    } = useAllArtworks(params, 12, '/artWork.json');

    // Ids of artworks the admin deleted (frontend only, so the card disappears from the grid)
    // TODO: remove this once real delete API + refetch is connected
    const [deletedIds, setDeletedIds] = useState([]);

    const handleDelete = (id) => {
        // TODO: call real delete API here
        setDeletedIds((prev) => [...prev, id]);
    };

    // Hide the ones already deleted (loading er somoy artworks undefined hole crash na kore)
    const visibleArtworks = (artworks || []).filter((art) => !deletedIds.includes(art.id));
    const visibleFilteredCount = (filteredArtworks || []).filter(
        (art) => !deletedIds.includes(art.id)
    ).length;

    // Grid er jaygay ki dekhabe: skeleton / error / cards / empty
    const renderContent = () => {
        if (loading) {
            return <ArtworkSkeleton />;
        }

        if (error) {
            return (
                <div className="py-20 text-center text-sm text-red-500">
                    {error}
                </div>
            );
        }

        if (visibleArtworks.length > 0) {
            return (
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
                            isGallery={true}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
                <p className="text-sm font-semibold text-[#334155]">
                    Kono artwork pawa jayni!
                </p>
                <p className="mt-1 text-xs text-[#64748B]">
                    Apnar filter ba criteria change kore abar chesta korun.
                </p>
            </div>
        );
    };

    return (
        <div className="w-full space-y-4 pb-12">
            {/* Top Header Section */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                        Competition
                    </h1>
                </div>
            </div>

            {/* Filter Component (always visible, loading er somoyo thakbe) */}
            <MyArtworkFilter
                totalShown={visibleArtworks.length}
                totalFiltered={visibleFilteredCount}
            />

            {/* Artwork Cards Grid Section (skeleton ekhane dekhabe) */}
            {renderContent()}

            {/* Pagination Component */}
            {!loading && !error && <Pagination totalPages={totalPages} />}
        </div>
    );
};

export default CompetitionManagementPage;