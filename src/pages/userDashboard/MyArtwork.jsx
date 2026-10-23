import { Link, useSearchParams } from "react-router";
import { FiPlus } from "react-icons/fi";
import useAllArtworks from "../../hooks/useAllArtworks";
import Pagination from "../../components/shared/Pagination";
import ArtworkStats from "../../components/ui/ArtworkStats";
import MyArtworkFilter from "../../components/ui/MyArtworkFilter";
import DashboardArtworkCard from "../../components/ui/DashboardArtworkCard"; // Notun card import kora holo

const MyArtwork = () => {
    const [searchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries());

    const {
        artworks,
        filteredArtworks,
        totalPages,
        loading,
        error,
    } = useAllArtworks(params, 12, '/artWork.json');

    if (loading) return <div className="py-20 text-center text-sm text-gray-500">Loading artworks...</div>;
    if (error) return <div className="py-20 text-center text-sm text-red-500">{error}</div>;

    return (
        <div className="w-full  space-y-6 pb-12">
            {/* Top Header Section */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                        My Artwork
                    </h1>
                    <p className="mt-1 text-xs text-[#6B7280]">
                        Manage your photos and albums, control your competition entries, and showcase your work on your profile.
                    </p>
                </div>

                <Link
                to={'/user-dashboard/artwork-management/UploadArtWorkTypes'}

                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                    <FiPlus size={16} />
                    Upload Artwork
                </Link>
            </div>

            {/* Stats Cards Component */}
            <ArtworkStats filteredArtworks={filteredArtworks} />

            {/* Filter Component */}
            <MyArtworkFilter 
                totalShown={artworks.length} 
                totalFiltered={filteredArtworks.length} 
            />

            {/* Artwork Cards Grid Section */}
            {artworks.length > 0 ? (
                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
                    {artworks.map((artWorkData) => (
                        <DashboardArtworkCard
                            key={
                                artWorkData.id ??
                                artWorkData._id ??
                                `${artWorkData.userId}-${artWorkData.title}`
                            }
                            artWorkData={artWorkData}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
                    <p className="text-sm font-semibold text-[#334155]">
                        Kono artwork pawa jayni[cite: 1]!
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

export default MyArtwork;