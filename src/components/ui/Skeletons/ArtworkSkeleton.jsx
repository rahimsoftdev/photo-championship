
const ArtworkSkeleton = ({ count = 9 }) => {
    return (
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <article
                    key={index}
                    className="w-full min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
                >
                    {/* Artwork image */}
                    <div className="relative h-[205px] w-full animate-pulse bg-gray-200">
                        {/* Album badge */}
                        <div className="absolute left-3 top-3 h-6 w-28 rounded-full bg-gray-300" />

                        {/* Report menu */}
                        <div className="absolute right-3 top-3 flex gap-1">
                            <div className="size-1 rounded-full bg-gray-400" />
                            <div className="size-1 rounded-full bg-gray-400" />
                            <div className="size-1 rounded-full bg-gray-400" />
                        </div>

                        {/* Save button */}
                        <div className="absolute bottom-2.5 left-2.5 h-8 w-[76px] rounded-md bg-gray-300" />

                        {/* Photo count */}
                        <div className="absolute bottom-2.5 right-2.5 h-7 w-20 rounded-md bg-gray-300" />
                    </div>

                    {/* Artwork information */}
                    <div className="p-3">
                        {/* Title */}
                        <div className="h-7 w-3/4 animate-pulse rounded-md bg-gray-200" />

                        {/* Description */}
                        <div className="mt-3 space-y-2">
                            <div className="h-3.5 w-full animate-pulse rounded bg-gray-200" />
                            <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-200" />
                        </div>

                        {/* Love, views and date */}
                        <div className="mt-4 flex items-center justify-between gap-2">
                            <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                            <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                        </div>

                        {/* Price */}
                        <div className="mt-3 h-6 w-20 animate-pulse rounded bg-gray-200" />
                    </div>
                </article>
            ))}
        </div>
    );
};

export default ArtworkSkeleton;
