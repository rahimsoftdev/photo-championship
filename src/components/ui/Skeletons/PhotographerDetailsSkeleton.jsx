import React from 'react';

const PhotographerDetailsSkeleton = () => {
    return (
        <div className="max-w-main mx-auto px-4 pt-5 sm:pt-12 lg:pt-15 animate-pulse">

            {/* Cover Photo Skeleton */}
            <div className="w-full h-[120px] sm:h-[220px] md:h-[270px] lg:h-[360px] xl:h-[400px] rounded-2xl bg-gray-200" />

            {/* Profile Information Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between px-4 sm:px-6 -mt-14 sm:-mt-16 gap-4 relative z-10">

                {/* Profile Photo & User Information */}
                <div className="flex flex-col lg:flex-row sm:items-end gap-4">

                    {/* Profile Photo */}
                    <div className="w-20 h-20 sm:w-25 sm:h-25 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 shrink-0" />

                    {/* Name, Username, Title & Country */}
                    <div className="flex flex-col justify-end pb-1 gap-2">

                        {/* Name */}
                        <div className="h-6 sm:h-7 w-36 sm:w-48 rounded-md bg-gray-200" />

                        {/* Username & Other Details */}
                        <div className="flex items-center flex-wrap gap-2">
                            <div className="h-3.5 w-24 rounded bg-gray-200" />
                            <div className="h-3.5 w-20 rounded bg-gray-200" />
                            <div className="h-3.5 w-16 rounded bg-gray-200" />
                        </div>

                    </div>
                </div>

                {/* Follow & Message Buttons */}
                <div className="flex items-center gap-2.5 sm:mb-2">
                    <div className="h-9 sm:h-10 w-28 rounded-lg bg-gray-200" />
                    <div className="h-9 sm:h-10 w-28 rounded-lg bg-gray-200" />
                </div>

            </div>

            {/* Navigation Tabs Skeleton */}
            <div className="max-w-[500px] bg-gray-50 p-3 rounded-xl border border-gray-200/70 mt-6">
                <div className="flex items-center gap-8 overflow-hidden px-2">

                    <div className="h-4 w-12 shrink-0 rounded bg-gray-200" />
                    <div className="h-4 w-20 shrink-0 rounded bg-gray-200" />
                    <div className="h-4 w-16 shrink-0 rounded bg-gray-200" />
                    <div className="h-4 w-28 shrink-0 rounded bg-gray-200" />
                    <div className="h-4 w-12 shrink-0 rounded bg-gray-200" />

                </div>
            </div>

            {/* Outlet Content Skeleton */}
            <div className="mt-4 lg:mt-11 space-y-5">

                {/* Section Heading */}
                <div className="space-y-2">
                    <div className="h-6 w-40 rounded bg-gray-200" />
                    <div className="h-3.5 w-64 max-w-full rounded bg-gray-200" />
                </div>

                {/* Artwork Filter Skeleton */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="h-8 w-20 rounded-lg bg-gray-200" />
                    <div className="h-8 w-20 rounded-lg bg-gray-200" />
                    <div className="h-8 w-24 rounded-lg bg-gray-200" />
                </div>

                {/* Artwork Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="rounded-xl overflow-hidden">

                            {/* Artwork Image */}
                            <div className="aspect-[4/3] rounded-xl bg-gray-200" />

                            {/* Artwork Details */}
                            <div className="pt-3 space-y-2">
                                <div className="h-4 w-3/4 rounded bg-gray-200" />
                                <div className="h-3 w-1/2 rounded bg-gray-200" />
                                <div className="h-3 w-2/3 rounded bg-gray-200" />
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default PhotographerDetailsSkeleton;