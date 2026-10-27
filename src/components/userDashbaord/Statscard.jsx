import { FiCreditCard, FiDollarSign, FiPercent, FiShoppingBag } from "react-icons/fi";

const money = (n) =>
    `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Card = ({ label, value, hint, icon: Icon, iconCls, highlight, loading }) => (
    <div
        className={`min-w-0 rounded-2xl border bg-white p-4 sm:p-5 ${
            highlight ? "border-emerald-300 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]" : "border-gray-200"
        }`}
    >
        <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</p>
                {loading ? (
                    <div className="mt-3 h-7 w-24 animate-pulse rounded bg-gray-200" />
                ) : (
                    <p
                        className={`mt-2 truncate text-xl font-bold sm:text-2xl ${
                            highlight ? "text-emerald-600" : "text-gray-900"
                        }`}
                    >
                        {value}
                    </p>
                )}
                <p className="mt-1 text-[10px] text-gray-400">{hint}</p>
            </div>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconCls}`}>
                <Icon size={16} />
            </span>
        </div>
    </div>
);

const StatsCard = ({ stats, isLoading }) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card
            label="Total Orders"
            value={stats.totalOrders}
            hint="All time across your store"
            icon={FiShoppingBag}
            iconCls="bg-gray-900 text-amber-300"
            loading={isLoading}
        />
        <Card
            label="Total Sales"
            value={money(stats.totalSales)}
            hint="Gross revenue before fees"
            icon={FiCreditCard}
            iconCls="bg-sky-100 text-sky-600"
            loading={isLoading}
        />
        <Card
            label="Platform Commission"
            value={money(stats.commission)}
            hint="Retained by LensArena"
            icon={FiPercent}
            iconCls="bg-amber-100 text-amber-600"
            loading={isLoading}
        />
        <Card
            label="Your Earnings"
            value={money(stats.earnings)}
            hint="90% goes straight to you"
            icon={FiDollarSign}
            iconCls="bg-emerald-500 text-white"
            highlight
            loading={isLoading}
        />
    </div>
);

export default StatsCard;