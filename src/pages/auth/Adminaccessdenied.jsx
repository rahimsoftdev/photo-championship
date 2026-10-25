import React from 'react';
import { Link } from 'react-router';
import { FiLock, FiGrid, FiHome } from 'react-icons/fi';

const AdminAccessDenied = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FA] px-4 py-10">
            <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center shadow-sm sm:p-10">
                {/* Icon */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDE8E9] sm:h-20 sm:w-20">
                    <FiLock className="h-7 w-7 text-[#EE1C25] sm:h-9 sm:w-9" />
                </div>

                {/* Status code */}
                <p className="text-xs font-bold uppercase tracking-widest text-[#EE1C25]">
                    Error 403
                </p>

                {/* Title */}
                <h1 className="mt-2 text-xl font-bold leading-snug text-[#111827] sm:text-2xl">
                    Access Denied
                </h1>

                {/* Message */}
                <p className="mt-3 text-sm leading-6 text-[#6B7280] sm:text-base">
                    Sorry, you don&apos;t have permission to open the Admin Dashboard.
                    This area is only for administrators. If you think this is a
                    mistake, please contact the site admin.
                </p>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 sm:mt-8">
                    <Link
                        to="/user-dashboard"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#EE1C25] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#D00000]"
                    >
                        <FiGrid size={16} />
                        Go to My Dashboard
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#494453] transition hover:bg-gray-50"
                    >
                        <FiHome size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminAccessDenied;