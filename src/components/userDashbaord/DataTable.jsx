import React from 'react';

/**
 * columns: [{ key, label, render?(row), className? }]
 * variant: 'default' | 'striped'
 */
const DataTable = ({ columns, rows, variant = 'default', emptyText = 'No results found' }) => {
  const striped = variant === 'striped';

  if (!rows.length) {
    return <p className="py-10 text-center text-xs text-gray-400">{emptyText}</p>;
  }

  const getValue = (col, row) => (col.render ? col.render(row) : row[col.key]);

  return (
    <>
      {/* Tablet + Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table
          className={`w-full min-w-[640px] text-left text-xs ${
            striped ? 'border-separate border-spacing-y-1' : ''
          }`}
        >
          <thead>
            <tr
              className={
                striped
                  ? 'text-gray-700 text-xs'
                  : 'border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-wider'
              }
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`font-semibold whitespace-nowrap ${striped ? 'py-2.5 px-4' : 'pb-3 pr-4'}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={striped ? '' : 'divide-y divide-gray-50 text-slate-700'}>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={
                  striped
                    ? `${idx % 2 === 0 ? 'bg-[#FEEFEF]' : 'bg-white'} text-slate-800 [&>td:first-child]:rounded-l-lg [&>td:last-child]:rounded-r-lg`
                    : 'hover:bg-gray-50/50 transition'
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`${striped ? 'py-3.5 px-4' : 'py-4 pr-4'} ${col.className || 'text-gray-600'}`}
                  >
                    {getValue(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 space-y-2.5 ${
              striped && idx % 2 === 0 ? 'bg-[#FEEFEF] border-transparent' : 'bg-white border-gray-100'
            }`}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-start justify-between gap-4 text-xs">
                <span className="text-gray-400 font-medium shrink-0">{col.label}</span>
                <span className={`text-right min-w-0 break-words ${col.className || 'text-gray-600'}`}>
                  {getValue(col, row)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default DataTable;