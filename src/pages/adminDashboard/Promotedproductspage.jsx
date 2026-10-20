import React from 'react';
import { useSearchParams } from 'react-router';
import LoadingPage from '../feedback/LoadingPage';
import useFetch from '../../hooks/useFetch';
import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
import PromotedProductCard from '../../components/admin/Promotedproductcard';
import Pagination from '../../components/shared/Pagination';
// import MyArtworkFilter from '../../components/ui/MyArtworkFilter';
// import Pagination from '../../components/ui/Pagination'; // TODO: adjust path to your Pagination file
// import PromotedProductCard from '../../components/ui/PromotedProductCard'; // TODO: adjust path if needed
// import useFetch from '../../hooks/useFetch';

const PAGE_SIZE = 12; // cards per page

// MyArtworkFilter sends these values in ?albumType=...  ->  albumType saved in promoted.json
// TODO: add real info or data (keep in sync with your filter values)
const albumTypeMap = {
    'single-photo': 'single',
    '6-photo-story': 'six',
    '12-photos-full-zodiac-story': 'twelve',
};

const PromotedProductsPage = () => {
    // Read ?albumType=...&page=... from the URL (MyArtworkFilter and Pagination write these)
    const [searchParams] = useSearchParams();
    const albumFilter = searchParams.get('albumType') || '';
    const pageFromUrl = Number(searchParams.get('page')) || 1;

    // Promoted items come from /public/promoted.json
    // TODO: confirm the shape your useFetch hook returns ({ data, isLoading, error })
    const { data, isLoading, error } = useFetch('/Promoted.json');

    if (isLoading) return <LoadingPage />;

    if (error) {
        return <p className="text-red-500">{String(error)}</p>;
    }

    const allProducts = Array.isArray(data) ? data : [];

    // 1) Filter by album type
    const filteredProducts = albumFilter
        ? allProducts.filter((item) => item.albumType === albumTypeMap[albumFilter])
        : allProducts;

    // 2) Paginate
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const currentPage = Math.min(Math.max(pageFromUrl, 1), totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <section className="w-full space-y-6 pb-12">
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111827]">
                Promoted Products
            </h1>

            {/* Filter: totalShown = cards on this page, totalFiltered = all items after filter */}
            <MyArtworkFilter
                totalShown={pageProducts.length}
                totalFiltered={filteredProducts.length}
            />

            {/* Cards grid */}
            {pageProducts.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pageProducts.map((product) => (
                        <PromotedProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
                    <p className="text-sm font-semibold text-[#334155]">No promoted products found.</p>
                    <p className="mt-1 text-xs text-[#64748B]">Try another filter.</p>
                </div>
            )}

            {/* Pagination: reads/writes ?page= itself, only needs totalPages */}
            <Pagination totalPages={totalPages} />
        </section>
    );
};

export default PromotedProductsPage;