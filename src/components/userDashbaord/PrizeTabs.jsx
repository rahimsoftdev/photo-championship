import React from 'react';

const PrizeTabs = ({ tabs, activeTab, onChange }) => (
  <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl w-max min-w-full sm:min-w-0 border border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`flex-1 sm:flex-none whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === tab
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-500 hover:text-slate-800 hover:bg-gray-50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default PrizeTabs;