import React from 'react';
import { useSearchParams } from 'react-router';
import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ totalPages = 1 }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.min(
    Math.max(Number(searchParams.get("page")) || 1, 1),
    Math.max(totalPages, 1)
  );

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage, "...", totalPages];
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
  };

  const buttonClass =
    "flex h-7 min-w-7 items-center justify-center rounded-lg border border-[#E5E7EB] px-2 text-xs text-[#374151] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40";

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5 mt-10">
      <button type="button" onClick={() => handlePageChange(1)} disabled={currentPage === 1} className={buttonClass}>
        <FiChevronsLeft size={15} />
      </button>

      <button type="button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={buttonClass}>
        <FiChevronLeft size={15} />
      </button>

      {getVisiblePages().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="flex h-7 min-w-7 items-center justify-center text-xs text-[#374151]">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            className={`${buttonClass} ${currentPage === page ? "border-[#EE1C25] bg-[#EE1C25] font-semibold text-white" : "bg-white"}`}
          >
            {page}
          </button>
        )
      )}

      <button type="button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={buttonClass}>
        <FiChevronRight size={15} />
      </button>

      <button type="button" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className={buttonClass}>
        <FiChevronsRight size={15} />
      </button>
    </nav>
  );
};

export default Pagination;