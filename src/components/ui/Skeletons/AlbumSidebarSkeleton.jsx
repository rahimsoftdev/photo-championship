const AlbumSidebarSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6 bg-white text-[#191919]">
            {/* Album Type */}
            <section>
                <div className="mb-4 h-5 w-28 rounded bg-gray-200" />

                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="size-4 shrink-0 rounded-sm bg-gray-200" />
                            <div
                                className="h-4 rounded bg-gray-200"
                                style={{
                                    width: ["110px", "100px", "180px"][index],
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Category */}
            <section>
                <div className="mb-3 h-5 w-24 rounded bg-gray-200" />

                <div className="space-y-5">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between gap-3"
                        >
                            <div
                                className="h-4 rounded bg-gray-200"
                                style={{
                                    width: ["100px", "125px", "85px", "115px", "95px", "120px"][index],
                                }}
                            />
                            <div className="size-4 rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AlbumSidebarSkeleton;
