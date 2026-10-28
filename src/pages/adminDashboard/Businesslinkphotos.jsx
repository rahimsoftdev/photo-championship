import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { FiEye } from 'react-icons/fi';
import { ALBUMS } from './Businesslinkphotosdata';
// import { ALBUMS } from './businessLinkPhotosData';

const PAGE_SIZE = 7;

const BusinessLinkPhotos = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const total = ALBUMS.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const rows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return ALBUMS.slice(start, start + PAGE_SIZE);
  }, [page]);

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  const handleView = (id) => {
    navigate(`/admin-dashboard/business-link-photos/details?id=${id}`);
  };

  return (
    <div className="w-full">
      <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Business Link Photos</h1>
      <p className="text-[11px] text-gray-500 mt-1 mb-4">
        Review uploaded 12-photo albums, generate business links, and manage submissions.
      </p>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        {/* ---------- Desktop / tablet: table ---------- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-gray-100 text-slate-700">
                <th className="font-medium px-4 lg:px-5 py-4">User</th>
                <th className="font-medium px-4 lg:px-5 py-4">Email</th>
                <th className="font-medium px-4 lg:px-5 py-4">Phone</th>
                <th className="font-medium px-4 lg:px-5 py-4">Country</th>
                <th className="font-medium px-4 lg:px-5 py-4">Upload Date</th>
                <th className="font-medium px-4 lg:px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-4 lg:px-5 py-4 lg:py-5 text-slate-800">{item.user}</td>
                  <td className="px-4 lg:px-5 py-4 lg:py-5 text-slate-700 max-w-[160px] break-all">{item.email}</td>
                  <td className="px-4 lg:px-5 py-4 lg:py-5 text-slate-700 whitespace-nowrap">{item.phone}</td>
                  <td className="px-4 lg:px-5 py-4 lg:py-5 text-slate-700">{item.country}</td>
                  <td className="px-4 lg:px-5 py-4 lg:py-5 text-slate-700 whitespace-nowrap">{item.uploadDate}</td>
                  <td className="px-4 lg:px-5 py-4 lg:py-5 text-center">
                    <button
                      type="button"
                      onClick={() => handleView(item.id)}
                      aria-label={`View ${item.user}'s album`}
                      className="p-1.5 rounded-full text-slate-700 hover:bg-gray-100 transition"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-12">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---------- Mobile: card list ---------- */}
        <div className="md:hidden divide-y divide-gray-100">
          {rows.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0 flex-1 space-y-1.5 text-[11px]">
                <p className="text-[13px] font-semibold text-slate-800 break-words">{item.user}</p>
                <p className="text-slate-700 break-all">{item.email}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
                  <span>{item.phone}</span>
                  <span>{item.country}</span>
                </div>
                <p className="text-gray-500">Uploaded: {item.uploadDate}</p>
              </div>
              <button
                type="button"
                onClick={() => handleView(item.id)}
                aria-label={`View ${item.user}'s album`}
                className="p-2 rounded-full text-slate-700 hover:bg-gray-100 transition flex-shrink-0"
              >
                <FiEye className="w-4 h-4" />
              </button>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="text-center text-[11px] text-gray-400 py-10">No submissions found.</p>
          )}
        </div>

        {/* ---------- Footer / Pagination ---------- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-4 border-t border-gray-100">
          <p className="text-[11px] text-indigo-600 text-center sm:text-left">
            Showing {from} to {to} of {total} results
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-md border border-indigo-500 text-indigo-600 text-[11px] font-medium hover:bg-indigo-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-md border border-indigo-500 text-indigo-600 text-[11px] font-medium hover:bg-indigo-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLinkPhotos;