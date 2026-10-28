import React from 'react';

const StatCard = ({ label, value, note, valueClassName = 'text-slate-900' }) => (
  <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
    <h3 className={`text-xl lg:text-2xl font-bold break-words ${valueClassName}`}>{value}</h3>
    <p className="text-[10px] text-gray-400 mt-1">{note}</p>
  </div>
);

export default StatCard;