import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

const useProducts = (itemsPerPage = 8) => {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL theke category ebong page read kora
  const currentCategory = searchParams.get('category') || 'All Items';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/product.json');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setAllProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Category filtering logic
  const filteredProducts = currentCategory === 'All Items'
    ? allProducts
    : allProducts.filter(
        (item) => item.category.toLowerCase() === currentCategory.toLowerCase()
      );

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return {
    products: currentProducts,
    totalProducts: filteredProducts.length,
    totalPages,
    currentPage,
    currentCategory,
    loading,
    error,
  };
};

export default useProducts;