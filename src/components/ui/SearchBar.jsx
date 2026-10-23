
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams, useNavigate } from "react-router";

/**
 * Reusable search bar that updates the URL's title query while typing.
 */
const SearchBar = ({
    bgColor = "#FFFFFF",
    width = "400px",
    isHero = false,
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(
        searchParams.get("title") || ""
    );
    const navigate = useNavigate();

    // Sync the input with the title query in the URL.
    useEffect(() => {
        setSearch(searchParams.get("title") || "");
    }, [searchParams]);

    // Update the URL automatically after typing stops briefly.
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isHero) return;

            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);

                    if (search.trim()) {
                        next.set("title", search);
                    } else {
                        next.delete("title");
                    }

                    return next;
                },
                { replace: true }
            );
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, setSearchParams, isHero]);

    // Navigate to the competition page when searching from Hero.
    useEffect(() => {
        if (!isHero) return;

        const timeout = setTimeout(() => {
            const title = search.trim();

            if (title) {
                navigate(
                    `/feed/competition?title=${encodeURIComponent(title)}`,
                    { replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, isHero, navigate]);

    return (
        <div
            className="flex h-12 max-w-full items-center gap-3 rounded-lg px-4"
            style={{
                backgroundColor: bgColor,
                maxWidth: width,
            }}
        >
            <FiSearch
                size={20}
                className="shrink-0 text-[#8A98A7]"
                aria-hidden="true"
            />

            <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                aria-label="Search by title"
                className="w-full min-w-0 bg-transparent text-sm text-[#8A98A7] outline-none placeholder:text-[#8A98A7]"
            />
        </div>
    );
};

export default SearchBar;
