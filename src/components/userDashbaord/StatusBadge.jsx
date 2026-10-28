import React from 'react';

const StatusBadge = ({ status }) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    {status}
  </span>
);

export default StatusBadge;