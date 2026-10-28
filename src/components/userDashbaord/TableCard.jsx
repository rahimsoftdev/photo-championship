import React from 'react';

const TableCard = ({ title, subtitle, actions, children }) => (
  <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5 sm:space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
    {children}
  </div>
);

export default TableCard;