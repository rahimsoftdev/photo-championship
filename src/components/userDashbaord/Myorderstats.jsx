import { FiCheckCircle, FiClock, FiShoppingBag, FiTruck } from "react-icons/fi";

const TONES = {
    gray: {
        box: "border-gray-200",
        blob: "bg-gray-50",
        label: "text-gray-500",
        icon: "bg-gray-100 text-gray-600",
        hint: "text-gray-500",
    },
    amber: {
        box: "border-amber-200",
        blob: "bg-amber-50",
        label: "text-amber-600",
        icon: "bg-amber-100/70 text-amber-500",
        hint: "text-amber-600",
    },
    purple: {
        box: "border-purple-200",
        blob: "bg-purple-50",
        label: "text-purple-600",
        icon: "bg-purple-100/70 text-purple-500",
        hint: "text-purple-600",
    },
    green: {
        box: "border-emerald-200",
        blob: "bg-emerald-50",
        label: "text-emerald-600",
        icon: "bg-emerald-100/70 text-emerald-500",
        hint: "text-emerald-600",
    },
};

const Card = ({ label, value, hint, icon: Icon, tone, loading }) => {
    const t = TONES[tone];

    return (
        <div className={`relative min-w-0 overflow-hidden rounded-2xl border bg-white p-4 sm:p-5 ${t.box}`}>
            {/* কোণার হালকা বৃত্ত */}
            <span className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${t.blob}`} />

            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-wide ${t.label}`}>{label}</p>

                    {loading ? (
                        <div className="mt-3 h-7 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                            <span className="text-2xl font-bold text-gray-900">{value}</span>
                            <span className={`text-[11px] font-medium ${t.hint}`}>{hint}</span>
                        </p>
                    )}
                </div>

                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.icon}`}>
                    <Icon size={15} />
                </span>
            </div>
        </div>
    );
};

const MyOrderStats = ({ counts, isLoading }) => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card
            label="Total Orders"
            value={counts.all}
            hint="All time"
            icon={FiShoppingBag}
            tone="gray"
            loading={isLoading}
        />
        <Card
            label="Processing"
            value={counts.processing}
            hint="In preparation"
            icon={FiClock}
            tone="amber"
            loading={isLoading}
        />
        <Card
            label="Shipped"
            value={counts.shipped}
            hint="On the road"
            icon={FiTruck}
            tone="purple"
            loading={isLoading}
        />
        <Card
            label="Delivered"
            value={counts.delivered}
            hint="Completed"
            icon={FiCheckCircle}
            tone="green"
            loading={isLoading}
        />
    </div>
);

export default MyOrderStats;