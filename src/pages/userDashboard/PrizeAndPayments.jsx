import React, { useState } from 'react';
import { FiDownload, FiInfo, FiSearch, FiChevronDown } from 'react-icons/fi';

const PrizeAndPayments = () => {
  // Active Main Tab State ('Prize Money' | 'Donations' | 'Photo Sales' | 'Store Sales')
  const [activeTab, setActiveTab] = useState('Prize Money');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // --- ARRAYS DATA ---

  // Payment History Data (Matching Image)
  const paymentHistoryData = [
    { date: 'Jul 5, 2025', type: 'Withdrawal', accountType: 'Stripe', accountNumber: '(702) 555-0122', amount: '$1,250.00', status: 'Approved' },
    { date: 'Jul 7, 2025', type: 'Withdrawal', accountType: 'Stripe', accountNumber: '(406) 555-0120', amount: '$1,250.00', status: 'Approved' },
    { date: 'Jul 8, 2025', type: 'Withdrawal', accountType: 'Stripe', accountNumber: '(205) 555-0100', amount: '$1,250.00', status: 'Approved' },
    { date: 'Jul 9, 2025', type: 'Withdrawal', accountType: 'Stripe', accountNumber: '(229) 555-0109', amount: '$1,250.00', status: 'Approved' },
    { date: 'Jul 10, 2025', type: 'Withdrawal', accountType: 'Stripe', accountNumber: '(319) 555-0115', amount: '$1,250.00', status: 'Approved' },
    { date: 'Jul 12, 2025', type: 'Withdrawal', accountType: 'Stripe', accountNumber: '(217) 555-0113', amount: '$1,250.00', status: 'Approved' },
  ];

  // Prize Money Data
  const prizeMoneyData = [
    { month: 'August 2026', competition: 'Celestial Wonders 2024', category: 'Nature', albumType: 'Single Photo', position: '1 st', totalVote: '12,408', prizeMoney: '$2000' },
    { month: 'July 2026', competition: 'Celestial Wonders 2024', category: 'Portrait', albumType: '6 Photos', position: '2 nd', totalVote: '80,000', prizeMoney: '$4000' },
    { month: 'June 2026', competition: 'Celestial Wonders 2024', category: 'Landscape', albumType: '12 Photos Zodiac Album', position: '1 st', totalVote: '4,000', prizeMoney: '$8000' },
    { month: 'October 2026', competition: 'Celestial Wonders 2024', category: 'Nature', albumType: '6 Photos', position: '3 rd', totalVote: '13,805', prizeMoney: '$7000' },
    { month: 'January 2026', competition: 'Celestial Wonders 2024', category: 'Animal', albumType: 'Single Photo', position: '1 st', totalVote: '20,589', prizeMoney: '$8000' },
    { month: 'March 2026', competition: 'Celestial Wonders 2024', category: 'Lifestyle', albumType: '6 Photos', position: '2 nd', totalVote: '56,800', prizeMoney: '$7000' },
  ];

  // Donations Data
  const donationsData = [
    { date: 'Aug 10, 2026', donorName: 'John Smith', email: 'john@example.com', donation: '$20.00', platformFee: '$2.00', yourEarnings: '$18.00', status: 'Available' },
    { date: 'Aug 08, 2026', donorName: 'Sarah Williams', email: 'sarah@example.com', donation: '$50.00', platformFee: '$5.00', yourEarnings: '$45.00', status: 'Available' },
    { date: 'Aug 05, 2026', donorName: 'Michael Chen', email: 'mchen@example.com', donation: '$100.00', platformFee: '$10.00', yourEarnings: '$90.00', status: 'Available' },
    { date: 'Aug 02, 2026', donorName: 'Emma Rodriguez', email: 'emma@example.com', donation: '$200.00', platformFee: '$20.00', yourEarnings: '$180.00', status: 'Available' },
    { date: 'Jul 28, 2026', donorName: 'David Kim', email: 'dkim@example.com', donation: '$150.00', platformFee: '$15.00', yourEarnings: '$135.00', status: 'Available' },
  ];

  // Photo Sales Data
  const photoSalesData = [
    { date: 'Aug 10, 2026', buyer: 'John Smith', email: 'john@example.com', photo: 'Mountain Sunrise', photoImg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&q=80', salePrice: '$75.00', yourEarnings: '$75.00', status: 'Available' },
    { date: 'Aug 09, 2026', buyer: 'Emily Carter', email: 'emily@example.com', photo: 'Golden Forest', photoImg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&q=80', salePrice: '$120.00', yourEarnings: '$120.00', status: 'Available' },
    { date: 'Aug 07, 2026', buyer: 'Marcus Lee', email: 'mlee@example.com', photo: 'Storm Over Bay', photoImg: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&q=80', salePrice: '$60.00', yourEarnings: '$60.00', status: 'Available' },
    { date: 'Aug 05, 2026', buyer: 'Nina Patel', email: 'nina@example.com', photo: 'Desert Dunes at Dusk', photoImg: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=100&q=80', salePrice: '$90.00', yourEarnings: '$90.00', status: 'Available' },
    { date: 'Aug 02, 2026', buyer: 'Oliver Grant', email: 'ogrant@example.com', photo: 'Midnight Aurora', photoImg: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=100&q=80', salePrice: '$45.00', yourEarnings: '$45.00', status: 'Available' },
  ];

  // Store Sales Data
  const storeSalesData = [
    { date: 'Aug 10, 2026', buyer: 'John Smith', email: 'john@example.com', photo: 'Mountain Sunrise', photoImg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&q=80', salePrice: '$75.00', commission: '$7.50', yourEarnings: '$67.50', status: 'Available' },
    { date: 'Aug 09, 2026', buyer: 'Emily Carter', email: 'emily@example.com', photo: 'Golden Forest', photoImg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&q=80', salePrice: '$120.00', commission: '$12.00', yourEarnings: '$108.00', status: 'Available' },
    { date: 'Aug 07, 2026', buyer: 'Marcus Lee', email: 'mlee@example.com', photo: 'Storm Over Bay', photoImg: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=100&q=80', salePrice: '$60.00', commission: '$6.00', yourEarnings: '$54.00', status: 'Available' },
    { date: 'Aug 05, 2026', buyer: 'Nina Patel', email: 'nina@example.com', photo: 'Desert Dunes at Dusk', photoImg: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=100&q=80', salePrice: '$90.00', commission: '$9.00', yourEarnings: '$81.00', status: 'Available' },
    { date: 'Aug 02, 2026', buyer: 'Oliver Grant', email: 'ogrant@example.com', photo: 'Midnight Aurora', photoImg: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=100&q=80', salePrice: '$45.00', commission: '$4.50', yourEarnings: '$40.50', status: 'Available' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 sm:p-6 lg:p-10 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Prize & Payments</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Track your competition prizes, donations, photo sales, and payout activity.
            </p>
          </div>
          <button className="bg-secondary text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-95 transition shadow-sm self-start sm:self-auto">
            Request Payout
          </button>
        </div>

        {/* Dynamic Tabs Navigation */}
        <div className="flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-xl w-fit border border-gray-100">
          {['Prize Money', 'Donations', 'Photo Sales', 'Store Sales'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ----------------- TAB CONTENTS ----------------- */}

        {/* 1. PRIZE MONEY TAB CONTENT */}
        {activeTab === 'Prize Money' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">TOTAL PRIZE MONEY</p>
                <h3 className="text-2xl font-bold text-slate-900">$2,500.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Total competition earnings</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">AVAILABLE</p>
                <h3 className="text-2xl font-bold text-emerald-600">$300.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Available for payout</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">PAID OUT</p>
                <h3 className="text-2xl font-bold text-slate-900">$1,500.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Already paid</p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900">My Prizing</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold text-[11px]">
                      <th className="pb-3 font-semibold">Month</th>
                      <th className="pb-3 font-semibold">Competitions Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Album Type</th>
                      <th className="pb-3 font-semibold">Position</th>
                      <th className="pb-3 font-semibold">Total Vote</th>
                      <th className="pb-3 font-semibold">Prize money</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-slate-700">
                    {prizeMoneyData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 text-gray-600">{row.month}</td>
                        <td className="py-4 font-semibold text-slate-800">{row.competition}</td>
                        <td className="py-4 text-gray-600">{row.category}</td>
                        <td className="py-4 text-gray-600">{row.albumType}</td>
                        <td className="py-4 text-gray-600">{row.position}</td>
                        <td className="py-4 text-gray-600">{row.totalVote}</td>
                        <td className="py-4 font-semibold text-slate-800">{row.prizeMoney}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-secondary font-medium">Showing 1 to 7 of 7 results</p>
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Previous
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DONATIONS TAB CONTENT */}
        {activeTab === 'Donations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">TOTAL DONATIONS</p>
                <h3 className="text-2xl font-bold text-slate-900">$1,240.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Gross donations</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">PLATFORM FEE</p>
                <h3 className="text-2xl font-bold text-amber-500">$124.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">10% platform commission</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">YOUR EARNINGS</p>
                <h3 className="text-2xl font-bold text-emerald-600">$1,116.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">90% of donations</p>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-100/80 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-primary font-medium">
              <FiInfo className="w-4 h-4 flex-shrink-0" />
              <span>Platform commission: <strong>10%</strong> per donation. You earn <strong>90%</strong> of each donation received.</span>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Donation Transactions</h2>
                <p className="text-xs text-gray-400 mt-0.5">All donations received from your supporters.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Donor Name</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Donation</th>
                      <th className="pb-3 font-semibold">Platform Fee</th>
                      <th className="pb-3 font-semibold">Your Earnings</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-slate-700">
                    {donationsData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 text-gray-500">{row.date}</td>
                        <td className="py-4 font-bold text-slate-800">{row.donorName}</td>
                        <td className="py-4 text-gray-500">{row.email}</td>
                        <td className="py-4 font-semibold text-slate-800">{row.donation}</td>
                        <td className="py-4 text-amber-500 font-medium">{row.platformFee}</td>
                        <td className="py-4 text-emerald-600 font-bold">{row.yourEarnings}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-secondary font-medium">Showing 1 to 7 of 7 results</p>
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Previous
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PHOTO SALES TAB CONTENT */}
        {activeTab === 'Photo Sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">TOTAL SALES</p>
                <h3 className="text-2xl font-bold text-slate-900">$1,850.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Gross photo sales</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">PHOTOS SOLD</p>
                <h3 className="text-2xl font-bold text-slate-900">24</h3>
                <p className="text-[10px] text-gray-400 mt-1">Total purchases</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">AVAILABLE EARNINGS</p>
                <h3 className="text-2xl font-bold text-emerald-600">$850.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Ready for payout</p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Photo Sales</h2>
                  <p className="text-xs text-gray-400 mt-0.5">All premium photo purchases from buyers.</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition">
                    Request Payout
                  </button>
                  <button className="border border-gray-200 text-gray-600 px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1.5">
                    <span>Export</span>
                    <FiDownload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="relative w-full sm:w-80">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search buyer, email, or photo name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 text-xs text-slate-800 outline-none focus:border-gray-300 focus:bg-white"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2 pr-8 text-xs text-gray-600 outline-none cursor-pointer"
                  >
                    <option>All Statuses</option>
                    <option>Available</option>
                    <option>Paid Out</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Buyer</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Photo</th>
                      <th className="pb-3 font-semibold">Sale Price</th>
                      <th className="pb-3 font-semibold">Your Earnings</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-slate-700">
                    {photoSalesData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 text-gray-500">{row.date}</td>
                        <td className="py-4 font-bold text-slate-800">{row.buyer}</td>
                        <td className="py-4 text-gray-500">{row.email}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2.5">
                            <img src={row.photoImg} alt={row.photo} className="w-7 h-7 rounded-lg object-cover" />
                            <span className="font-medium text-slate-800">{row.photo}</span>
                          </div>
                        </td>
                        <td className="py-4 font-semibold text-slate-800">{row.salePrice}</td>
                        <td className="py-4 text-emerald-600 font-bold">{row.yourEarnings}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="text-gray-400 hover:text-slate-800 font-medium text-xs">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-secondary font-medium">Showing 1 to 7 of 7 results</p>
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Previous
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. STORE SALES TAB CONTENT */}
        {activeTab === 'Store Sales' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">TOTAL SALES</p>
                <h3 className="text-2xl font-bold text-slate-900">$1,850.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Gross photo sales</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">PHOTOS SOLD</p>
                <h3 className="text-2xl font-bold text-slate-900">24</h3>
                <p className="text-[10px] text-gray-400 mt-1">Total purchases</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">AVAILABLE EARNINGS</p>
                <h3 className="text-2xl font-bold text-emerald-600">$850.00</h3>
                <p className="text-[10px] text-gray-400 mt-1">Ready for payout</p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-dashed border-blue-400 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Photo Sales</h2>
                  <p className="text-xs text-gray-400 mt-0.5">All premium photo purchases from buyers.</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 transition">
                    Request Payout
                  </button>
                  <button className="border border-gray-200 text-gray-600 px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-1.5">
                    <span>Export</span>
                    <FiDownload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="relative w-full sm:w-80">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search buyer, email, or photo name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 text-xs text-slate-800 outline-none focus:border-gray-300 focus:bg-white"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2 pr-8 text-xs text-gray-600 outline-none cursor-pointer"
                  >
                    <option>All Statuses</option>
                    <option>Available</option>
                    <option>Paid Out</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Buyer</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Photo</th>
                      <th className="pb-3 font-semibold">Sale Price</th>
                      <th className="pb-3 font-semibold">Comission</th>
                      <th className="pb-3 font-semibold">Your Earnings</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-slate-700">
                    {storeSalesData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 text-gray-500">{row.date}</td>
                        <td className="py-4 font-bold text-slate-800">{row.buyer}</td>
                        <td className="py-4 text-gray-500">{row.email}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2.5">
                            <img src={row.photoImg} alt={row.photo} className="w-7 h-7 rounded-lg object-cover" />
                            <span className="font-medium text-slate-800">{row.photo}</span>
                          </div>
                        </td>
                        <td className="py-4 font-semibold text-slate-800">{row.salePrice}</td>
                        <td className="py-4 text-gray-500 font-medium">{row.commission}</td>
                        <td className="py-4 text-emerald-600 font-bold">{row.yourEarnings}</td>
                        <td className="py-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="text-gray-400 hover:text-slate-800 font-medium text-xs">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-secondary font-medium">Showing 1 to 7 of 7 results</p>
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Previous
                  </button>
                  <button className="px-3.5 py-1.5 rounded-lg border border-secondary text-secondary text-xs font-semibold hover:bg-secondary/5 transition">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- REVISED EXACT MATCH: PAYMENT HISTORY SECTION ----------------- */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment History</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-separate border-spacing-y-1">
              <thead>
                <tr className="text-gray-700 font-medium text-xs">
                  <th className="py-2.5 px-4 font-semibold">Date</th>
                  <th className="py-2.5 px-4 font-semibold">Type</th>
                  <th className="py-2.5 px-4 font-semibold">Account Type</th>
                  <th className="py-2.5 px-4 font-semibold">Account Number</th>
                  <th className="py-2.5 px-4 font-semibold">Amount</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistoryData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? 'bg-[#FEEFEF]' : 'bg-white'
                    } hover:opacity-95 transition-all text-slate-800`}
                  >
                    <td className="py-3.5 px-4 font-medium text-slate-800 rounded-l-lg">{row.date}</td>
                    <td className="py-3.5 px-4 text-slate-700">{row.type}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.accountType}</td>
                    <td className="py-3.5 px-4 text-slate-700">{row.accountNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.amount}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600 rounded-r-lg">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Pagination - Exact colors from Image 8 */}
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-[#EAB308] font-medium">Showing 1 to 7 of 7 results</p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 rounded-xl border border-[#FDE047] text-[#EAB308] text-xs font-medium hover:bg-yellow-50 transition">
                Previous
              </button>
              <button className="px-4 py-1.5 rounded-xl border border-[#FDE047] text-[#EAB308] text-xs font-medium hover:bg-yellow-50 transition">
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrizeAndPayments;