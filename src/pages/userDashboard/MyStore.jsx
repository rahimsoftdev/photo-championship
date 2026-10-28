import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router';
import { FiPlus, FiLayers } from 'react-icons/fi';
import useProducts from '../../hooks/useProducts.js';
import ProductCard from '../../components/userDashbaord/ui/ProductCard.jsx';
import Pagination from '../../components/shared/Pagination.jsx';
import ArtworkSkeleton from '../../components/ui/Skeletons/ArtworkSkeleton.jsx';
// import { Pagination } from '@heroui/react';

const MyStore = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, totalPages, loading, error, currentCategory } = useProducts(8);

  // Edit / Delete-er por data update dekhanor jonno local state
  const [deletedIds, setDeletedIds] = useState(() => new Set());
  const [edits, setEdits] = useState({});

  // Delete kora product bad, edit kora product-e notun data boshano
  const visibleProducts = useMemo(
    () =>
      (products || [])
        .filter((p) => !deletedIds.has(p.id))
        .map((p) => (edits[p.id] ? { ...p, ...edits[p.id] } : p)),
    [products, deletedIds, edits]
  );

  const categories = ['All Items', 'Art Prints', 'Handmade Crafts', 'Apparel', 'Photobooks', 'Digital Preset'];

  const handleCategoryClick = (category) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (category === 'All Items') {
        next.delete('category');
      } else {
        next.set('category', category);
      }
      next.set('page', '1');
      return next;
    });
  };

  const handleEdit = (updated) => {
    setEdits((prev) => ({ ...prev, [updated.id]: updated }));
  };

  const handleDelete = (id) => {
    setDeletedIds((prev) => new Set(prev).add(id));
  };

  if (loading) return <ArtworkSkeleton/>
  if (error) return <div className="text-center py-12 sm:py-20 px-4 text-sm sm:text-base text-red-500 break-words">Error: {error}</div>;

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="w-full">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-gray-100 rounded-md text-gray-700 shrink-0">
                <FiLayers size={18} />
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">My Store</h1>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              Explore Art, handmade products and creative merchandise.
            </p>
          </div>

          <button
            onClick={() => navigate('/user-dashboard/my-store/new')}
            className="w-full sm:w-auto shrink-0 bg-red-500 hover:bg-red-600 text-white font-medium px-4 sm:px-5 py-2.5 rounded-lg text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiPlus size={16} />
            <span className="whitespace-nowrap">Upload Product</span>
          </button>
        </div>

        {/* FILTER CATEGORY TABS WITH bg-primary */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 mb-6 sm:mb-8 no-scrollbar border-b">
          {categories.map((cat) => {
            const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* PRODUCTS GRID */}
        {visibleProducts.length === 0 ? (
          <div className="text-center py-12 sm:py-20 text-sm sm:text-base text-gray-400">No products found in this category.</div>
        ) : (
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* PAGINATION COMPONENT */}
        <div className="flex justify-center overflow-x-auto mt-6 sm:mt-8 pb-2">
          <Pagination totalPages={totalPages} />
        </div>

      </div>
    </div>
  );
};

export default MyStore;