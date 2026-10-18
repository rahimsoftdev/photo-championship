import { FiLayers, FiImage, FiGrid, FiAward } from "react-icons/fi";

const ArtworkStats = ({ filteredArtworks = [] }) => {
    const totalCount = filteredArtworks.length;
    const singlePhotos = filteredArtworks.filter(art => art.albumType === 'single-photo').length;
    const sixPhotoAlbums = filteredArtworks.filter(art => art.albumType === '6-photo-story').length;
    const twelvePhotoAlbums = filteredArtworks.filter(art => art.albumType?.includes('12')).length;
    const competitionEntries = filteredArtworks.filter(art => art.type === 'competition').length;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-[#6B7280]">Total Artwork</p>
                    <p className="mt-2 text-2xl font-bold text-[#111827]">{totalCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                    <FiLayers size={20} />
                </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-[#6B7280]">Single Photos</p>
                    <p className="mt-2 text-2xl font-bold text-[#111827]">{singlePhotos}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                    <FiImage size={20} />
                </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-[#6B7280]">6 Photo Albums</p>
                    <p className="mt-2 text-2xl font-bold text-[#111827]">{sixPhotoAlbums}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                    <FiGrid size={20} />
                </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-[#6B7280]">12 Photo Albums</p>
                    <p className="mt-2 text-2xl font-bold text-[#111827]">{twelvePhotoAlbums}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                    <FiGrid size={20} />
                </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-[#6B7280]">Competition Entries</p>
                    <p className="mt-2 text-2xl font-bold text-[#111827]">{competitionEntries}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 text-gray-600">
                    <FiAward size={20} />
                </div>
            </div>
        </div>
    );
};

export default ArtworkStats;