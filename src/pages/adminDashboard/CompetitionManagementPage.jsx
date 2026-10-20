import { Pagination } from '@heroui/react';
import React, { useState } from 'react';
// import AdminArtworkCard from '../../components/ui/AdminArtworkCard';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import ArtworkStats from '../../components/ui/ArtworkStats';
import { FiPlus } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router';
import useAllArtworks from '../../hooks/useAllArtworks';
import AdminArtworkCard from '../../components/admin/Adminartworkcard';

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

    if (loading) return <div className="py-20 text-center text-sm text-gray-500">Loading artworks...</div>;
    if (error) return <div className="py-20 text-center text-sm text-red-500">{error}</div>;

    // Hide the ones already deleted
    const visibleArtworks = artworks.filter((art) => !deletedIds.includes(art.id));
    const visibleFilteredCount = filteredArtworks.filter((art) => !deletedIds.includes(art.id)).length;

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Top Header Section */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                        Competition
                    </h1>
                </div>
            </div>

            {/* Stats Cards Component */}
            {/* <ArtworkStats filteredArtworks={filteredArtworks} /> */}

            {/* Filter Component */}
            <MyArtworkFilter
                totalShown={visibleArtworks.length}
                totalFiltered={visibleFilteredCount}
            />

            {/* Artwork Cards Grid Section */}
            {visibleArtworks.length > 0 ? (
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
            ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
                    <p className="text-sm font-semibold text-[#334155]">
                        Kono artwork pawa jayni!
                    </p>
                    <p className="mt-1 text-xs text-[#64748B]">
                        Apnar filter ba criteria change kore abar chesta korun.
                    </p>
                </div>
            )}

            {/* Pagination Component */}
            <Pagination totalPages={totalPages} />
        </div>
    );
};

export default CompetitionManagementPage;