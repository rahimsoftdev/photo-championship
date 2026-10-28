import React, { useState } from 'react';
import { Link } from 'react-router';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ReferenceDot,
} from 'recharts';
import { FiArrowUpRight, FiChevronDown } from 'react-icons/fi';

/* ------------------------------------------------------------------ */
/*  DATA (all arrays of objects)                                       */
/* ------------------------------------------------------------------ */

// TODO: add real info or data (logged-in admin name from auth/user API)
const adminInfo = {
    name: 'Adriana',
    title: "Here's your competition pulse.",
    subtitle: 'Keep a clear view of the stories, people, and moments moving through My12Photos.',
};

// TODO: add real info or data (first row stats from API)
const topStats = [
    { id: 1, label: 'Registered users', value: '24,892' },
    { id: 2, label: 'Photos submitted', value: '184,390' },
    { id: 3, label: 'Votes cast', value: '1.24M' },
    { id: 4, label: 'Total Commission', value: '$13000.00' },
    { id: 5, label: 'This Month Commission', value: '$1300.00' },
];

// TODO: add real info or data (second row stats from API)
const bottomStats = [
    { id: 1, label: 'Total Promoted', value: '$16000.00' },
    { id: 2, label: 'This Month Promoted', value: '$160.00' },
    { id: 3, label: 'Total Revenue', value: '$26985.00' },
    { id: 4, label: 'Total Payouts', value: '$16985.00' },
];

// TODO: add real info or data (monthly unique visitors from analytics API)
const visitorData = [
    { month: 'Jan', visitors: 2200 },
    { month: 'Feb', visitors: 3100 },
    { month: 'Mar', visitors: 3900 },
    { month: 'Apr', visitors: 5000 },
    { month: 'May', visitors: 5700 },
    { month: 'Jun', visitors: 6300 },
    { month: 'Jul', visitors: 6800 },
    { month: 'Aug', visitors: 7300 },
    { month: 'Sep', visitors: 8100 },
    { month: 'Oct', visitors: 8500 },
    { month: 'Nov', visitors: 9600 },
    { month: 'Dec', visitors: 11000 },
];

// TODO: add real info or data (total unique visitors + highlighted month)
const visitorSummary = {
    total: '88,420',
    highlightMonth: 'Aug',
};

// TODO: add real info or data (recent competition submissions from API)
const recentCompetition = {
    pendingCount: 126,
    reviewAllLink: '/adminDashboard/competitions',
    openLink: '/adminDashboard/competitions',
    items: [
        {
            id: 1,
            title: 'When the river sleeps',
            author: 'Maya Sutanto',
            country: 'Indonesia',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=120',
        },
        {
            id: 2,
            title: "A stranger's garden",
            author: 'Jon Bell',
            country: 'United Kingdom',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=120',
        },
        {
            id: 3,
            title: 'The room with no ceiling',
            author: 'Sofia Nyström',
            country: 'Sweden',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=120',
        },
    ],
};

// TODO: add real info or data (revenue per month, per year, from API)
const revenueData = [
    { month: 'Jan', commission: 20000, promoted: 40000, donation: 21000 },
    { month: 'Feb', commission: 30000, promoted: 32000, donation: 34000 },
    { month: 'Mar', commission: 32000, promoted: 29000, donation: 40000 },
    { month: 'Apr', commission: 25000, promoted: 42000, donation: 33000 },
    { month: 'May', commission: 25000, promoted: 56000, donation: 26000 },
    { month: 'Jun', commission: 56000, promoted: 46000, donation: 58000 },
    { month: 'Jul', commission: 58000, promoted: 46000, donation: 78000 },
    { month: 'Aug', commission: 52000, promoted: 30000, donation: 72000 },
    { month: 'Sep', commission: 40000, promoted: 26000, donation: 56000 },
    { month: 'Oct', commission: 64000, promoted: 24000, donation: 80000 },
    { month: 'Nov', commission: 52000, promoted: 38000, donation: 62000 },
    { month: 'Dec', commission: 38000, promoted: 26000, donation: 48000 },
];

// TODO: add real info or data (years list from API)
const revenueYears = ['This year', 'Last year'];

// TODO: add real info or data (series config / labels for revenue chart)
const revenueSeries = [
    { key: 'commission', label: 'Commission', tooltipLabel: 'Commission Store', color: '#F59E0B' },
    { key: 'promoted', label: 'Promoted', tooltipLabel: 'Promoted', color: '#10B981' },
    { key: 'donation', label: 'Donation', tooltipLabel: 'Commission Donation', color: '#4F46E5' },
];

// TODO: add real info or data (top countries by participation from API)
const communityReach = [
    { id: 1, country: 'United States', code: 'us', count: 4283 },
    { id: 2, country: 'United Kingdom', code: 'gb', count: 2740 },
    { id: 3, country: 'Indonesia', code: 'id', count: 1958 },
    { id: 4, country: 'Japan', code: 'jp', count: 1421 },
];

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

const StatCard = ({ label, value }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04)] px-5 py-4 min-w-0">
        <p className="text-xs sm:text-[13px] text-gray-500 truncate">{label}</p>
        <p className="mt-3 text-xl sm:text-2xl font-semibold text-gray-900 truncate">{value}</p>
    </div>
);

const RevenueTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    // order: Commission Donation, Promoted, Commission Store
    const order = ['donation', 'promoted', 'commission'];
    const rows = order
        .map((key) => {
            const series = revenueSeries.find((s) => s.key === key);
            const entry = payload.find((p) => p.dataKey === key);
            return entry ? { ...series, value: entry.value } : null;
        })
        .filter(Boolean);

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2.5 min-w-[130px]">
            {rows.map((row) => (
                <div key={row.key} className="mb-1.5 last:mb-0">
                    <p className="text-[10px] text-gray-500 leading-tight">{row.tooltipLabel}</p>
                    <p className="text-sm font-bold leading-tight" style={{ color: row.color }}>
                        ${row.value.toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const AdminOverview = () => {
    const [selectedYear, setSelectedYear] = useState(revenueYears[0]);
    const maxReach = Math.max(...communityReach.map((c) => c.count));
    const highlightPoint = visitorData.find((d) => d.month === visitorSummary.highlightMonth);

    // TODO: add real info or data (fetch revenueData again when selectedYear changes)

    return (
        <div className="w-full max-w-full">
            {/* Header */}
            <header className="mb-5 sm:mb-6">
                <p className="text-[10px] sm:text-[11px] tracking-wider uppercase text-gray-500 font-medium">
                    Good morning, {adminInfo.name}
                </p>
                <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 break-words">
                    {adminInfo.title}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-2xl">{adminInfo.subtitle}</p>
            </header>

            {/* Stats Row 1 */}
            <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                {topStats.map((stat) => (
                    <StatCard key={stat.id} label={stat.label} value={stat.value} />
                ))}
            </section>

            {/* Stats Row 2 */}
            <section className="mt-3 sm:mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {bottomStats.map((stat) => (
                    <StatCard key={stat.id} label={stat.label} value={stat.value} />
                ))}
            </section>

            {/* Visitor analytics + Recent competition */}
            <section className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Visitor analytics */}
                <div className="min-w-0 lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 lg:p-6">
                    <h2 className="text-sm font-semibold text-gray-900">Visitor analytics</h2>
                    <p className="text-xs text-gray-500 mt-1">Unique visitors and return sessions</p>
                    <p className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                        {visitorSummary.total}
                    </p>

                    <div className="mt-2 h-[200px] sm:h-[240px] lg:h-[280px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitorData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="visitorFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3B6FE8" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#3B6FE8" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="#F0F1F5" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    interval="preserveStartEnd"
                                    minTickGap={8}
                                />
                                <YAxis
                                    width={36}
                                    ticks={[0, 4000, 8000, 12000]}
                                    domain={[0, 12000]}
                                    tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}k`)}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#9CA3AF', strokeDasharray: '4 4' }}
                                    contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                    formatter={(v) => [v.toLocaleString(), 'Visitors']}
                                />
                                {highlightPoint && (
                                    <>
                                        <ReferenceLine
                                            x={highlightPoint.month}
                                            stroke="#9CA3AF"
                                            strokeDasharray="4 4"
                                        />
                                        <ReferenceDot
                                            x={highlightPoint.month}
                                            y={highlightPoint.visitors}
                                            r={5}
                                            fill="#fff"
                                            stroke="#3B6FE8"
                                            strokeWidth={2}
                                        />
                                    </>
                                )}
                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="#3B6FE8"
                                    strokeWidth={2.5}
                                    fill="url(#visitorFill)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent competition */}
                <div className="min-w-0 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 lg:p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-semibold text-gray-900">Recent Competition</h2>
                        <Link
                            to={recentCompetition.reviewAllLink}
                            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
                        >
                            Review all <FiArrowUpRight size={12} />
                        </Link>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                        {recentCompetition.pendingCount} submissions need a decision
                    </p>

                    <ul className="mt-5 space-y-4 flex-1">
                        {recentCompetition.items.map((item) => (
                            <li key={item.id} className="flex items-center gap-3 min-w-0">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-10 h-10 rounded-md object-cover shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-semibold text-gray-900 truncate">
                                        {item.title}
                                    </p>
                                    <p className="text-[11px] text-gray-500 truncate">
                                        {item.author} · {item.country}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Link
                        to={recentCompetition.openLink}
                        className="mt-6 block w-full text-center bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-semibold py-2.5 rounded-md transition-colors"
                    >
                        Open Competition
                    </Link>
                </div>
            </section>

            {/* Revenue Trend */}
            <section className="mt-5 sm:mt-6 min-w-0 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                        Revenue Trend
                    </h2>

                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 rounded-md text-xs text-gray-600 pl-3 pr-8 py-2 focus:outline-none cursor-pointer"
                        >
                            {revenueYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown
                            size={14}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                    </div>
                </div>

                <div className="mt-4 h-[240px] sm:h-[300px] lg:h-[340px] w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#EEF0F4" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#6B7280' }}
                                interval="preserveStartEnd"
                                minTickGap={8}
                            />
                            <YAxis
                                width={40}
                                ticks={[0, 20000, 40000, 60000, 80000]}
                                domain={[0, 80000]}
                                tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}k`)}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#6B7280' }}
                            />
                            <Tooltip
                                content={<RevenueTooltip />}
                                cursor={{ stroke: '#9CA3AF', strokeDasharray: '4 4' }}
                            />
                            {revenueSeries.map((series) => (
                                <Line
                                    key={series.key}
                                    type="monotone"
                                    dataKey={series.key}
                                    stroke={series.color}
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: series.color }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-3 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
                    {revenueSeries
                        .filter((s) => s.key !== 'donation')
                        .map((series) => (
                            <div key={series.key} className="flex items-center gap-1.5">
                                <span
                                    className="inline-block w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: series.color }}
                                />
                                <span className="text-[11px] text-gray-500">{series.label}</span>
                            </div>
                        ))}
                </div>
            </section>

            {/* Community reach */}
            <section className="mt-5 sm:mt-6 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 lg:p-6">
                <h2 className="text-sm font-semibold text-gray-900">Community reach</h2>
                <p className="text-xs text-gray-400 mt-1">Top countries by participation</p>

                <ul className="mt-5 space-y-4">
                    {communityReach.map((item) => (
                        <li key={item.id} className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-2.5 w-[96px] sm:w-[130px] lg:w-[150px] shrink-0 min-w-0">
                                <img
                                    src={`https://flagcdn.com/w40/${item.code}.png`}
                                    alt={item.country}
                                    className="w-4 h-4 rounded-full object-cover shrink-0"
                                />
                                <span className="text-xs font-semibold text-gray-800 truncate">
                                    {item.country}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#3B6FE8] rounded-full"
                                    style={{ width: `${(item.count / maxReach) * 100}%` }}
                                />
                            </div>

                            <span className="w-12 sm:w-14 text-right text-[11px] font-semibold text-gray-700 shrink-0">
                                {item.count.toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminOverview;