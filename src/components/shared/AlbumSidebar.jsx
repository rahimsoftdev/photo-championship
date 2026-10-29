import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiSliders,
  FiX,
} from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import AlbumSidebarSkeleton from "../ui/Skeletons/AlbumSidebarSkeleton";

// Available album types. Only one type can be selected at a time.
const albumTypes = [
  { label: "Single Photo", value: "single-photo" },
  { label: "6 Photo Story", value: "6-photo-story" },
  {
    label: "12 Photos - Full Zodiac Story",
    value: "12-photos-full-zodiac-story",
  },
];

// Square checkbox: border changes color and a tick mark appears when checked.
const Checkbox = ({ name, value, checked, onChange }) => (
  <span className="relative mt-0.5 inline-flex size-4 shrink-0">
    <input
      type="checkbox"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="peer size-4 cursor-pointer appearance-none rounded-[3px] border border-gray-400 bg-white checked:border-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    />

    <FiCheck
      size={12}
      strokeWidth={3}
      className="pointer-events-none absolute inset-0 m-auto hidden text-secondary peer-checked:block"
    />
  </span>
);

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

  // Select the album type, or unselect it if it is already selected.
  const handleAlbumTypeChange = (value) => {
    updateQueryParams({
      albumType: selectedAlbumType === value ? "" : value,
    });
  };

  // Expand a category or collapse it if it is already expanded.
  const handleCategoryToggle = (categoryValue) => {
    setExpandedCategory((current) =>
      current === categoryValue ? "" : categoryValue
    );
  };

  // Select a subcategory (and its parent category), or unselect if already selected.
  const handleSubcategoryChange = (categoryValue, subcategoryValue) => {
    const isAlreadySelected =
      selectedCategory === categoryValue &&
      selectedSubcategory === subcategoryValue;

    if (isAlreadySelected) {
      updateQueryParams({ category: "", subcategory: "" });
      return;
    }

    updateQueryParams({
      category: categoryValue,
      subcategory: subcategoryValue,
    });
  };

  // Reusable sidebar content shared by mobile and desktop layouts.
  const sidebarContent = (
    <div className="flex h-full flex-col bg-white text-[#191919]">
      {/* Mobile-only heading and close button */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5  md:hidden">
        <h2 className="text-lg font-bold">Filters</h2>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
          aria-label="Close filters"
        >
          <FiX size={22} />
        </button>
      </div>

      {/* Scrollable content keeps the sidebar usable on small screens */}
      <div className="flex-1 space-y-6 overflow-y-auto p-5 md:p-0">
        {/* Album type: checkbox-style, single selection */}
        <section>
          <h3 className="mb-3 text-base font-bold">Album Type</h3>

          <div className="space-y-3">
            {albumTypes.map((type) => (
              <label
                key={type.value}
                className="flex cursor-pointer items-start gap-3 text-sm leading-5"
              >
                <Checkbox
                  name="albumType"
                  value={type.value}
                  checked={selectedAlbumType === type.value}
                  onChange={() => handleAlbumTypeChange(type.value)}
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

        {/* Category and nested subcategories */}
        <section>
          <h3 className="mb-2 text-base font-bold">Category</h3>

          {isLoading && (
            <p className="text-sm text-gray-500">Loading categories...</p>
          )}

          {error && (
            <p className="text-sm text-red-600">
              Could not load categories. Please try again.
            </p>
          )}

          {!isLoading && !error && Array.isArray(data) && (
            <div>
              {data.map((category) => {
                const isExpanded = expandedCategory === category.value;
                const isSelected = selectedCategory === category.value;

                return (
                  <div
                    key={category.value}
                    className={isExpanded ? "" : "border-b border-gray-200"}
                  >
                    {/* Category row expands or collapses its subcategory list */}
                    <button
                      type="button"
                      onClick={() => handleCategoryToggle(category.value)}
                      aria-expanded={isExpanded}
                      className={`flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium transition ${isExpanded || isSelected
                        ? "text-secondary"
                        : "text-gray-700 hover:text-gray-900"
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
                      <div className="space-y-3 pb-3 pl-3 pt-1">
                        {category.subcategories?.map((subcategory) => {
                          const isSubcategorySelected =
                            selectedCategory === category.value &&
                            selectedSubcategory === subcategory.value;

                          return (
                            <label
                              key={subcategory.value}
                              className="flex cursor-pointer items-start gap-3 text-xs leading-5"
                            >
                              <Checkbox
                                name="subcategory"
                                value={subcategory.value}
                                checked={isSubcategorySelected}
                                onChange={() =>
                                  handleSubcategoryChange(
                                    category.value,
                                    subcategory.value
                                  )
                                }
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

  if (isLoading) {
    return <AlbumSidebarSkeleton />
  }

  return (
    <>
      {/* Mobile/tablet filter button. Hidden on desktop (md and above). */}
      <div className="mb-3 md:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-expanded={isSidebarOpen}
          className="group inline-flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:border-secondary/40 hover:shadow-md active:scale-[0.99]"
        >
          <span className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
              <FiSliders size={19} />
            </span>

            <span className="text-left">
              <span className="block">Filters</span>
              <span className="mt-0.5 block text-xs font-normal text-gray-500">
                Refine your photo collection
              </span>
            </span>
          </span>

          <FiChevronRight
            size={20}
            className="text-gray-400 transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Desktop sidebar stays in the normal page layout (no outer border). */}
      <aside className="hidden w-full shrink-0 md:block md:max-w-[260px] lg:max-w-[280px]">
        {sidebarContent}
      </aside>

      {/* Mobile/tablet drawer: overlay + slide-in sidebar */}
      {isSidebarOpen && (
        <div className="absolute inset-0 h-full w-full bg-gray-950/50 backdrop-blur-[3px] z-222">
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