
import { useEffect, useState } from "react";

const useProduct = (id) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setData(null);

        const response = await fetch("/product.json");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const products = await response.json();

        const product = products.find(
          (item) => item.id === Number(id)
        );

        if (!product) {
          throw new Error("Product not found");
        }

        setData(product);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, isLoading, error };
};

export default useProduct;
