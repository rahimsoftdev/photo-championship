import React, { useState } from 'react';
import { FiDownload, FiInfo } from 'react-icons/fi';

// import PrizeTabs from '../../components/userDashboard/PrizeTabs';
import StatCard from '../../components/userDashbaord/StatCard';
import StatusBadge from '../../components/userDashbaord/StatusBadge';
import DataTable from '../../components/userDashbaord/DataTable';
import TableCard from '../../components/userDashbaord/TableCard';
import TableToolbar from '../../components/userDashbaord/TableToolbar';
import TablePagination from '../../components/userDashbaord/TablePagination';
import PaymentHistory from '../../components/userDashbaord/PaymentHistory';
import PayoutModal from '../../components/userDashbaord/PayoutModal';
import {
  TABS,
  prizeMoneyData,
  donationsData,
  photoSalesData,
  storeSalesData,
} from '../../components/userDashbaord/prizeAndPaymentsData';
import PrizeTabs from '../../components/userDashbaord/PrizeTabs';

/* ---------- Column definitions ---------- */

const prizeColumns = [
  { key: 'month', label: 'Month' },
  { key: 'competition', label: 'Competitions Name', className: 'font-semibold text-slate-800' },
  { key: 'category', label: 'Category' },
  { key: 'albumType', label: 'Album Type' },
  { key: 'position', label: 'Position' },
  { key: 'totalVote', label: 'Total Vote' },
  { key: 'prizeMoney', label: 'Prize money', className: 'font-semibold text-slate-800' },
];

const donationColumns = [
  { key: 'date', label: 'Date', className: 'text-gray-500' },
  { key: 'donorName', label: 'Donor Name', className: 'font-bold text-slate-800' },
  { key: 'email', label: 'Email', className: 'text-gray-500' },
  { key: 'donation', label: 'Donation', className: 'font-semibold text-slate-800' },
  { key: 'platformFee', label: 'Platform Fee', className: 'text-amber-500 font-medium' },
  { key: 'yourEarnings', label: 'Your Earnings', className: 'text-emerald-600 font-bold' },
  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
];

const photoCell = (r) => (
  <div className="flex items-center gap-2.5">
    <img src={r.photoImg} alt={r.photo} className="w-7 h-7 rounded-lg object-cover" />
    <span className="font-medium text-slate-800">{r.photo}</span>
  </div>
);

const detailsBtn = () => (
  <button type="button" className="text-gray-400 hover:text-slate-800 font-medium text-xs">
    Details
  </button>
);

const photoSalesColumns = [
  { key: 'date', label: 'Date', className: 'text-gray-500' },
  { key: 'buyer', label: 'Buyer', className: 'font-bold text-slate-800' },
  { key: 'email', label: 'Email', className: 'text-gray-500' },
  { key: 'photo', label: 'Photo', render: photoCell },
  { key: 'salePrice', label: 'Sale Price', className: 'font-semibold text-slate-800' },
  { key: 'yourEarnings', label: 'Your Earnings', className: 'text-emerald-600 font-bold' },
  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  { key: 'action', label: 'Action', render: detailsBtn },
];

const storeSalesColumns = [
  ...photoSalesColumns.slice(0, 5),
  { key: 'commission', label: 'Commission', className: 'text-gray-500 font-medium' },
  ...photoSalesColumns.slice(5),
];

/* ---------- Helpers ---------- */

const filterSales = (rows, term, status) => {
  const q = term.trim().toLowerCase();
  return rows.filter((r) => {
    const matchesSearch =
      !q ||
      r.buyer.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.photo.toLowerCase().includes(q);
    const matchesStatus = status === 'All Statuses' || r.status === status;
    return matchesSearch && matchesStatus;
  });
};

/* ---------- Page ---------- */

const PrizeAndPayments = () => {
  const [activeTab, setActiveTab] = useState('Prize Money');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);

  const openPayout = () => setIsPayoutOpen(true);
  const closePayout = () => setIsPayoutOpen(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setStatusFilter('All Statuses');
  };

  const photoRows = filterSales(photoSalesData, searchTerm, statusFilter);
  const storeRows = filterSales(storeSalesData, searchTerm, statusFilter);

  const salesActions = (
    <>
      <button
        type="button"
        onClick={openPayout}
        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
      >
        Request Payout
      </button>
      <button
        type="button"
        className="border border-gray-200 text-gray-600 px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1.5"
      >
        <span>Export</span>
        <FiDownload className="w-3.5 h-3.5" />
      </button>
    </>
  );

  const salesStats = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
      <StatCard label="TOTAL SALES" value="$1,850.00" note="Gross photo sales" />
      <StatCard label="PHOTOS SOLD" value="24" note="Total purchases" />
      <StatCard label="AVAILABLE EARNINGS" value="$850.00" note="Ready for payout" valueClassName="text-emerald-600" />
    </div>
  );

  const salesToolbar = (
    <TableToolbar
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      statusFilter={statusFilter}
      onStatusChange={setStatusFilter}
      placeholder="Search buyer, email, or photo name..."
    />
  );

  return (
    <div className="min-h-screen text-slate-800 font-sans">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">Prize & Payments</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Track your competition prizes, donations, photo sales, and payout activity.
            </p>
          </div>
          <button
            type="button"
            onClick={openPayout}
            className="w-full sm:w-auto bg-secondary text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-sm"
          >
            Request Payout
          </button>
        </div>

        {/* Tabs */}
        <PrizeTabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

        {/* 1. Prize Money */}
        {activeTab === 'Prize Money' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
              <StatCard label="TOTAL PRIZE MONEY" value="$2,500.00" note="Total competition earnings" />
              <StatCard label="AVAILABLE" value="$300.00" note="Available for payout" valueClassName="text-emerald-600" />
              <StatCard label="PAID OUT" value="$1,500.00" note="Already paid" />
            </div>

            <TableCard title="My Prizing">
              <DataTable columns={prizeColumns} rows={prizeMoneyData} />
              <TablePagination total={prizeMoneyData.length} />
            </TableCard>
          </div>
        )}

        {/* 2. Donations */}
        {activeTab === 'Donations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
              <StatCard label="TOTAL DONATIONS" value="$1,240.00" note="Gross donations" />
              <StatCard label="PLATFORM FEE" value="$124.00" note="10% platform commission" valueClassName="text-amber-500" />
              <StatCard label="YOUR EARNINGS" value="$1,116.00" note="90% of donations" valueClassName="text-emerald-600" />
            </div>

            <div className="bg-blue-50/70 border border-blue-100/80 rounded-xl p-3.5 flex items-start sm:items-center gap-2.5 text-xs text-primary font-medium">
              <FiInfo className="w-4 h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>
                Platform commission: <strong>10%</strong> per donation. You earn <strong>90%</strong> of each donation received.
              </span>
            </div>

            <TableCard title="Donation Transactions" subtitle="All donations received from your supporters.">
              <DataTable columns={donationColumns} rows={donationsData} />
              <TablePagination total={donationsData.length} />
            </TableCard>
          </div>
        )}

        {/* 3. Photo Sales */}
        {activeTab === 'Photo Sales' && (
          <div className="space-y-6">
            {salesStats}
            <TableCard
              title="Photo Sales"
              subtitle="All premium photo purchases from buyers."
              actions={salesActions}
            >
              {salesToolbar}
              <DataTable columns={photoSalesColumns} rows={photoRows} emptyText="No matching photo sales" />
              <TablePagination total={photoRows.length} />
            </TableCard>
          </div>
        )}

        {/* 4. Store Sales */}
        {activeTab === 'Store Sales' && (
          <div className="space-y-6">
            {salesStats}
            <TableCard
              title="Photo Sales"
              subtitle="All premium photo purchases from buyers."
              actions={salesActions}
            >
              {salesToolbar}
              <DataTable columns={storeSalesColumns} rows={storeRows} emptyText="No matching store sales" />
              <TablePagination total={storeRows.length} />
            </TableCard>
          </div>
        )}

        {/* Payment History */}
        <PaymentHistory />
      </div>

      {/* Payout modal */}
      <PayoutModal isOpen={isPayoutOpen} onClose={closePayout} />
    </div>
  );
};

export default PrizeAndPayments;