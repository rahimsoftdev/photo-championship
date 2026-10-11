import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router";

/**
 * Reusable search bar that updates the URL's title query while typing.
 */
const SearchBar = ({ bgColor = "#FFFFFF", width = '400px' }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(
        searchParams.get("title") || ""
    );

    // Sync the input with the title query in the URL.
    useEffect(() => {
        setSearch(searchParams.get("title") || "");
    }, [searchParams]);

    // Update the URL automatically after typing stops briefly.
    useEffect(() => {
        const timeout = setTimeout(() => {
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
    }, [search, setSearchParams]);

    return (
        <div
            className="flex h-12 max-w-full items-center gap-3 rounded-lg px-4"
            style={{
                backgroundColor: bgColor,
                maxWidth:width
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