import React from 'react';
import DataTable from './DataTable';
import TablePagination from './TablePagination';
import { paymentHistoryData } from './prizeAndPaymentsData';

const columns = [
  { key: 'date', label: 'Date', className: 'font-medium text-slate-800' },
  { key: 'type', label: 'Type', className: 'text-slate-700' },
  { key: 'accountType', label: 'Account Type', className: 'font-bold text-slate-900' },
  { key: 'accountNumber', label: 'Account Number', className: 'text-slate-700' },
  { key: 'amount', label: 'Amount', className: 'font-bold text-slate-900' },
  { key: 'status', label: 'Status', className: 'font-semibold text-emerald-600' },
];

const PaymentHistory = () => (
  <div className="space-y-4 pt-4">
    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Payment History</h2>
    <DataTable columns={columns} rows={paymentHistoryData} variant="striped" />
    <TablePagination total={paymentHistoryData.length} variant="yellow" />
  </div>
);

export default PaymentHistory;