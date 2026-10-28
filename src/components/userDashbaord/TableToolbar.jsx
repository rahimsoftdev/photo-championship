import React from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

const TableToolbar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  placeholder = 'Search...',
  statuses = ['All Statuses', 'Available', 'Paid Out'],
}) => (
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
    <div className="relative w-full sm:w-80">
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 text-xs text-slate-800 outline-none focus:border-gray-300 focus:bg-white"
      />
    </div>
    <div className="relative w-full sm:w-auto">
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full sm:w-auto appearance-none bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2 pr-8 text-xs text-gray-600 outline-none cursor-pointer"
      >
        {statuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
    </div>
  </div>
);

export default TableToolbar;