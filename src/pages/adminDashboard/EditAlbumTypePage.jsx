import React, { useEffect, useState } from 'react';
import { FiPlus, FiCheckCircle } from 'react-icons/fi';
import useFetch from '../../hooks/useFetch';
import AlbumCard from '../../components/ui/AlbumCard';
import AlbumTypeModal from '../../components/admin/Albumtypemoda';
// import AlbumCard from '../../components/ui/AlbumCard';
// import AlbumTypeModal from '../../components/ui/AlbumTypeModal'; // TODO: adjust path if needed
// import useFetch from '../../hooks/useFetch';

const AlbumTypesPage = () => {
    // Fetch album data using the custom useFetch hook (from /public/albumTypesData.json)
    // TODO: confirm the shape your useFetch hook returns ({ data, isLoading, error })
    const { data, isLoading, error } = useFetch('/albumTypesData.json');

    // Local copy so create / edit update the UI instantly (frontend only)
    const [albums, setAlbums] = useState([]);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState(null); // null = create mode

    // Success toast message
    const [toast, setToast] = useState('');

    // Copy fetched data into local state once it arrives
    useEffect(() => {
        if (Array.isArray(data)) setAlbums(data);
    }, [data]);

    // Auto-hide toast after 2.5s
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    /* ------------------------------ Modal controls ------------------------------ */

    const openCreateModal = () => {
        setEditingAlbum(null);
        setModalOpen(true);
    };

    const openEditModal = (album) => {
        setEditingAlbum(album);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    /* --------------------------------- Save ------------------------------------ */

    const handleSave = (albumData) => {
        if (editingAlbum) {
            // TODO: call real update-album-type API here
            setAlbums((prev) => prev.map((a) => (a.id === editingAlbum.id ? { ...a, ...albumData } : a)));
            setToast('Album type updated successfully');
        } else {
            // TODO: call real create-album-type API here (id should come from the server)
            setAlbums((prev) => [...prev, { ...albumData, id: Date.now() }]);
            setToast('Album type added successfully');
        }
        closeModal();
    };

    /* ----------------------------- Loading / error ----------------------------- */

    if (isLoading) {
        return (
            <div className="flex items-center justify-center px-4 py-20">
                <p className="text-center text-base font-manrope text-gray-500 sm:text-lg">
                    Loading album types...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center px-4 py-20">
                <p className="break-words text-center text-base font-manrope text-red-500 sm:text-lg">
                    Error: {error}
                </p>
            </div>
        );
    }

    /* ---------------------------------- UI ------------------------------------- */

    return (
        <div className="min-h-screen bg-[#F6F7FB] px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-8">
            {/* Success toast */}
            <div
                className={`fixed top-5 right-5 z-[80] flex items-center gap-2 bg-white border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
                    toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
            >
                <FiCheckCircle size={18} />
                <span>{toast}</span>
            </div>

            {/* Page header */}
            <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-[11px] tracking-[0.2em] uppercase text-gray-500 font-semibold">
                        Taxonomy
                    </p>
                    <h1 className="mt-2 text-3xl sm:text-4xl font-light text-gray-900">Album types</h1>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-xl">
                        Define how many photos each competition album can hold.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-1.5 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-medium px-4 py-2.5 rounded-md transition-colors"
                >
                    <FiPlus size={14} />
                    <span>Create Album type</span>
                </button>
            </header>

            {/* Choose Your Album Type section */}
            <section className="mx-auto w-full max-w-main">
                {/* Section Header */}
                <div className="mx-auto mb-8 w-full max-w-2xl text-center sm:mb-10 lg:mb-12">
                    <span className="mb-2 block font-manrope text-sm font-bold uppercase tracking-widest text-[#E31837] sm:text-base">
                        ACTIVE COMPETITIONS
                    </span>

                    <h2 className="mb-4 font-manrope text-3xl font-extrabold leading-tight text-[#0D0D14] sm:text-4xl sm:leading-tight md:text-[44px] lg:text-[48px] lg:leading-[48px]">
                        Choose Your Album Type
                    </h2>

                    <p className="font-manrope text-sm font-normal leading-relaxed text-[#6B7280] sm:text-base md:text-lg lg:text-[20px] lg:leading-[29.25px]">
                        Three competition album type. One goal: show your talent and win a prize.
                    </p>
                </div>

                {/* Responsive Cards Grid */}
                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 lg:gap-8">
                    {albums.length === 0 && (
                        <p className="col-span-full text-center text-sm text-gray-400">
                            No album types yet.
                        </p>
                    )}
                    {albums.map((album) => (
                        <AlbumCard key={album.id} album={album} isEdit onEdit={openEditModal} />
                    ))}
                </div>
            </section>

            {/* Create / Edit modal */}
            <AlbumTypeModal
                open={modalOpen}
                album={editingAlbum}
                onClose={closeModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default AlbumTypesPage;