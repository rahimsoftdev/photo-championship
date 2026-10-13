
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  FiChevronDown,
  FiChevronRight,
  FiSliders,
  FiX,
} from "react-icons/fi";
import useFetch from "../../hooks/useFetch";

// Available album types. Only one type can be selected at a time.
const albumTypes = [
  { label: "Single Photo", value: "single-photo" },
  { label: "6 Photo Story", value: "6-photo-story" },
  {
    label: "12 Photos - Full Zodiac Story",
    value: "12-photos-full-zodiac-story",
  },
];

const AlbumSidebar = () => {
  // Fetch categories and their subcategories from the public JSON file.
  const { data, isLoading, error } = useFetch("/albumCategories.json");

  const location = useLocation();
  const navigate = useNavigate();

  // Read current selections from the URL query parameters.
  const searchParams = new URLSearchParams(location.search);
  const selectedAlbumType = searchParams.get("albumType") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedSubcategory = searchParams.get("subcategory") || "";

  // Keep the selected category expanded by default.
  const [expandedCategory, setExpandedCategory] = useState(
    () => selectedCategory || "nature"
  );

  // Controls whether the mobile sidebar drawer is visible.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Update URL query parameters without removing unrelated parameters.
  const updateQueryParams = (updates) => {
    const params = new URLSearchParams(location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true }
    );
  };

  // Save the selected album type in the URL.
  const handleAlbumTypeChange = (value) => {
    updateQueryParams({ albumType: value });
  };

  // Expand a category or collapse it if it is already expanded.
  const handleCategoryToggle = (categoryValue) => {
    setExpandedCategory((current) =>
      current === categoryValue ? "" : categoryValue
    );
  };

  // Selecting a subcategory also records its parent category.
  const handleSubcategoryChange = (categoryValue, subcategoryValue) => {
    updateQueryParams({
      category: categoryValue,
      subcategory: subcategoryValue,
    });
  };

  // Reusable sidebar content shared by mobile and desktop layouts.
  const sidebarContent = (
    <div className="flex h-full flex-col bg-white text-[#191919]">
      {/* Sidebar heading and mobile close button */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-bold">Filters</h2>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
          aria-label="Close filters"
        >
          <FiX size={22} />
        </button>
      </div>

      {/* Scrollable content keeps the sidebar usable on small screens */}
      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        {/* Album type: radio-style square selection */}
        <section>
          <h3 className="mb-3 text-base font-bold">Album Type</h3>

          <div className="space-y-3">
            {albumTypes.map((type) => (
              <label
                key={type.value}
                className="flex cursor-pointer items-start gap-3 text-sm leading-5"
              >
                <input
                  type="radio"
                  name="albumType"
                  value={type.value}
                  checked={selectedAlbumType === type.value}
                  onChange={() => handleAlbumTypeChange(type.value)}
                  className="mt-0.5 size-4 shrink-0 appearance-none rounded-none border border-gray-400 checked:border-secondary checked:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                />

                <span
                  className={
                    selectedAlbumType === type.value
                      ? "font-semibold text-secondary"
                      : "text-gray-700"
                  }
                >
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-200" />

        {/* Categories and nested subcategories */}
        <section>
          <h3 className="mb-3 text-base font-bold">Categories</h3>

          {isLoading && (
            <p className="text-sm text-gray-500">Loading categories...</p>
          )}

          {error && (
            <p className="text-sm text-red-600">
              Could not load categories. Please try again.
            </p>
          )}

          {!isLoading && !error && Array.isArray(data) && (
            <div className="space-y-1">
              {data.map((category) => {
                const isExpanded =
                  expandedCategory === category.value;

                const isSelected =
                  selectedCategory === category.value;

                return (
                  <div key={category.value}>
                    {/* Category row expands or collapses its subcategory list */}
                    <button
                      type="button"
                      onClick={() =>
                        handleCategoryToggle(category.value)
                      }
                      aria-expanded={isExpanded}
                      className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-2.5 text-left text-sm font-medium transition hover:bg-gray-50 ${
                        isExpanded || isSelected
                          ? "text-secondary"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{category.name}</span>

                      {isExpanded ? (
                        <FiChevronDown className="shrink-0" size={17} />
                      ) : (
                        <FiChevronRight className="shrink-0" size={17} />
                      )}
                    </button>

                    {/* Render subcategories only for the expanded category */}
                    {isExpanded && (
                      <div className="ml-3 space-y-1 border-l border-gray-200 py-1 pl-3">
                        {category.subcategories?.map((subcategory) => {
                          const isSubcategorySelected =
                            selectedCategory === category.value &&
                            selectedSubcategory === subcategory.value;

                          return (
                            <label
                              key={subcategory.value}
                              className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm leading-5"
                            >
                              <input
                                type="radio"
                                name="subcategory"
                                value={subcategory.value}
                                checked={isSubcategorySelected}
                                onChange={() =>
                                  handleSubcategoryChange(
                                    category.value,
                                    subcategory.value
                                  )
                                }
                                className="mt-0.5 size-4 shrink-0 appearance-none rounded-none border border-gray-400 checked:border-secondary checked:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                              />

                              <span
                                className={
                                  isSubcategorySelected
                                    ? "font-semibold text-secondary"
                                    : "text-gray-600"
                                }
                              >
                                {subcategory.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile/tablet filter button. Hidden on desktop (md and above). */}
      <div className="mb-4 md:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-expanded={isSidebarOpen}
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <FiSliders size={18} />
          Filters
        </button>
      </div>

      {/* Desktop sidebar stays in the normal page layout. */}
      <aside className="hidden w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 md:block md:max-w-[260px] lg:max-w-[280px]">
        {sidebarContent}
      </aside>

      {/* Mobile/tablet drawer: overlay + slide-in sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Clicking outside the sidebar closes the drawer */}
          <button
            type="button"
            aria-label="Close filters overlay"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />

          {/* Sidebar panel */}
          <aside className="absolute inset-y-0 left-0 flex w-[85%] max-w-[320px] flex-col overflow-hidden bg-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default AlbumSidebar;
