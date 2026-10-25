import React from 'react';

const NoPhotosFound = () => {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5l4.5-4.5a2.121 2.121 0 013 0l3 3m0 0l1.5-1.5a2.121 2.121 0 013 0L21 16.5M5.25 19.5h13.5A2.25 2.25 0 0021 17.25v-10.5A2.25 2.25 0 0018.75 4.5H5.25A2.25 2.25 0 003 6.75v10.5a2.25 2.25 0 002.25 2.25z"
                    />
                </svg>
            </div>

            <h3 className="mb-2 text-lg font-semibold text-[#171D2B]">
                No Photos Found
            </h3>

            <p className="max-w-sm text-sm leading-6 text-gray-500">
                There are no photos to display right now. Try changing your search
                or filters, or check back later.
            </p>
        </div>
    );
};

export default NoPhotosFound;