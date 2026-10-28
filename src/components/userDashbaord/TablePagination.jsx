import React from 'react';

const styles = {
  primary: {
    text: 'text-secondary',
    btn: 'border-secondary text-secondary hover:bg-secondary/5',
  },
  yellow: {
    text: 'text-[#EAB308]',
    btn: 'border-[#FDE047] text-[#EAB308] hover:bg-yellow-50',
  },
};

const TablePagination = ({ total, variant = 'primary' }) => {
  const s = styles[variant];
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <p className={`text-xs font-medium ${s.text}`}>
        Showing {total ? 1 : 0} to {total} of {total} results
      </p>
      <div className="flex items-center gap-2">
        {['Previous', 'Next'].map((label) => (
          <button
            key={label}
            type="button"
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition ${s.btn}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TablePagination;