import React from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router';
import { FiPlus, FiLayers } from 'react-icons/fi';
import useProducts from '../../hooks/useProducts.js';
import ProductCard from '../../components/userDashbaord/ui/ProductCard.jsx';
import { Pagination } from '@heroui/react';

const MyStore = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, totalPages, loading, error, currentCategory } = useProducts(8);

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

  if (loading) return <div className="text-center py-20 text-gray-500">Loading store...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="">
      <div className="">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-gray-100 rounded-md text-gray-700">
                <FiLayers size={18} />
              </span>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Store</h1>
            </div>
            <p className="text-gray-500 text-sm">
              Explore Art, handmade products and creative merchandise.
            </p>
          </div>

          <button 
            onClick={() => navigate('/user-dashboard/my-store/new')}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <FiPlus size={16} />
            Upload Product
          </button>
        </div>

        {/* FILTER CATEGORY TABS WITH bg-primary */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = currentCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
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
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={(updated) => console.log('Updated:', updated)}
                onDelete={(id) => console.log('Delete ID:', id)}
              />
            ))}
          </div>
        )}

        {/* PAGINATION COMPONENT */}
        <Pagination totalPages={totalPages} />

      </div>
    </div>
  );
};

export default MyStore;