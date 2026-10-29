import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { useTopPhotographers } from '../../hooks/useTopPhotographers';

const FILTERS = [
    { key: 'single', label: 'Single Photo', shortLabel: 'Single' },
    { key: 'six', label: '6 Photos', shortLabel: '6 Photos' },
    { key: 'twelve', label: '12 Photos - Full Zodiac Story', shortLabel: '12 Photos' },
];

/**
 * Medal circle (1st / 2nd / 3rd).
 * Size fluid hoy (clamp) — mobile theke 4K screen porjonto auto scale kore.
 */
const RenderMedal = ({ rank, size = 'md' }) => {
    const sizeClass =
        size === 'lg'
            ? 'h-[clamp(1.25rem,3.5vw,1.875rem)] w-[clamp(1.25rem,3.5vw,1.875rem)] text-[clamp(0.625rem,1.5vw,0.875rem)]'
            : 'h-[clamp(1.25rem,3.5vw,1.75rem)] w-[clamp(1.25rem,3.5vw,1.75rem)] text-[clamp(0.625rem,1.5vw,0.875rem)]';

    const base = `inline-flex shrink-0 items-center justify-center rounded-full font-bold leading-none shadow-sm ${sizeClass}`;

    if (rank === 1) {
        return (
            <span
                className={`${base} text-black`}
                style={{ backgroundColor: '#FDC700' }}
            >
                1
            </span>
        );
    }

    if (rank === 2) {
        return <span className={`${base} bg-slate-300 text-slate-800`}>2</span>;
    }

    if (rank === 3) {
        return <span className={`${base} bg-amber-600 text-white`}>3</span>;
    }

    return (
        <span className="text-xs font-medium text-subTitleText sm:text-sm">
            {rank}
        </span>
    );
};

export default function TopPhotographersSection() {
    const { pathname } = useLocation();
    // /admin-dashboard/winners (ba /admin-dashboard/** ) hole admin layout
    const isAdmin = pathname.startsWith('/admin-dashboard');

    const [selectedType, setSelectedType] = useState('six');

    const { isLoading, error, data = [] } = useTopPhotographers(selectedType);

    const topThree = data.slice(0, 3);
    const tableData = data;

    // Podium order: Rank 2, Rank 1, Rank 3
    const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

    return (
        <section
            className={`w-full overflow-x-hidden bg-[#f8fafc] font-sans ${
                isAdmin
                    ? 'm-0 p-0'
                    : 'px-3 py-8 min-[400px]:px-4 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10 lg:py-section xl:px-12 2xl:px-16'
            }`}
        >
            <div
                className={`w-full ${
                    isAdmin
                        ? 'm-0 max-w-none space-y-4 p-0 sm:space-y-6'
                        : 'mx-auto max-w-main space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12'
                }`}
            >
                {/* Header & Filter Nav */}
                <div
                    className={`flex w-full min-w-0 flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 ${
                        isAdmin ? 'm-0 p-0' : ''
                    }`}
                >
                    <div className="min-w-0">
                        <h1 className="break-words text-xl font-extrabold tracking-tight text-titleText min-[400px]:text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl">
                            Top Photographers
                        </h1>

                        <p className="mt-1 text-xs text-subTitleText sm:text-sm md:text-base 2xl:text-lg">
                            July 2026 — Live standings
                        </p>
                    </div>

                    {/* Filter Controls */}
                    <div className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-slate-200/50 p-1 sm:gap-1.5 sm:p-1.5 md:inline-flex md:w-fit md:rounded-full lg:shrink-0">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                type="button"
                                onClick={() => setSelectedType(f.key)}
                                className={`rounded-full px-2 py-2 text-center text-[11px] font-medium leading-tight transition-all duration-200 min-[400px]:text-xs sm:px-3 sm:text-sm md:whitespace-nowrap md:px-4 xl:px-5 xl:py-2.5 2xl:text-base ${
                                    selectedType === f.key
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-subTitleText hover:text-titleText'
                                }`}
                            >
                                {/* Short label on mobile, full label from md */}
                                <span className="md:hidden">{f.shortLabel}</span>
                                <span className="hidden md:inline">{f.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading and Error States */}
                {isLoading && (
                    <p className="py-6 text-center text-sm text-subTitleText">
                        Loading photographers...
                    </p>
                )}

                {error && (
                    <p className="py-6 text-center text-sm text-red-500">
                        Failed to load photographers. Please try again.
                    </p>
                )}

                {/* Podium Section */}
                {!isLoading && !error && podiumOrder.length > 0 && (
                    <div
                        className={`flex w-full items-end justify-center gap-[clamp(0.5rem,3vw,3rem)] pb-2 pt-8 sm:pt-10 ${
                            isAdmin
                                ? 'm-0 max-w-none px-0'
                                : 'mx-auto max-w-2xl px-1 lg:max-w-3xl 2xl:max-w-4xl'
                        }`}
                    >
                        {podiumOrder.map((photographer) => {
                            const isFirst = photographer.ranking === 1;
                            const info = photographer.photographerinfo || {};

                            return (
                                <div
                                    key={photographer.userId}
                                    className={`flex min-w-0 max-w-[16rem] flex-1 basis-0 flex-col items-center text-center transition-transform ${
                                        isFirst
                                            ? '-translate-y-2 sm:-translate-y-3 lg:-translate-y-4'
                                            : ''
                                    }`}
                                >
                                    {/* Avatar + medal circle */}
                                    <div className="relative mb-2 sm:mb-3">
                                        <div className="absolute -top-[clamp(0.625rem,1.8vw,1rem)] left-1/2 z-10 -translate-x-1/2">
                                            <RenderMedal
                                                rank={photographer.ranking}
                                                size="lg"
                                            />
                                        </div>

                                        <div
                                            className={`rounded-full p-0.5 sm:p-1 ${
                                                isFirst
                                                    ? 'ring-2 ring-[#FDC700] sm:ring-4'
                                                    : 'ring-1 ring-slate-300 sm:ring-2'
                                            }`}
                                        >
                                            <img
                                                src={info.image}
                                                alt={info.name || 'Photographer'}
                                                loading="lazy"
                                                decoding="async"
                                                className={`aspect-square rounded-full object-cover shadow-lg ${
                                                    isFirst
                                                        ? 'h-[clamp(3.25rem,13vw,6rem)] w-[clamp(3.25rem,13vw,6rem)]'
                                                        : 'h-[clamp(2.5rem,10vw,4.5rem)] w-[clamp(2.5rem,10vw,4.5rem)]'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="w-full truncate px-0.5 text-xs font-bold text-titleText min-[400px]:text-sm sm:text-base md:text-lg 2xl:text-xl">
                                        {(info.name || '').split(' ')[0]}
                                    </h3>

                                    <p className="mb-0.5 w-full truncate px-0.5 text-[10px] text-subTitleText min-[400px]:text-xs sm:mb-1 sm:text-sm 2xl:text-base">
                                        {photographer.city}
                                    </p>

                                    <p className="whitespace-nowrap text-[10px] font-bold text-secondary min-[400px]:text-xs sm:text-sm md:text-base 2xl:text-lg">
                                        {(photographer.vots ?? 0).toLocaleString()} votes
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Leaderboard */}
                {!isLoading && !error && (
                    <div
                        className="w-full overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl"
                        style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                    >
                        {/* Mobile: Card list (below md) */}
                        <ul className="divide-y divide-slate-100 md:hidden">
                            {tableData.length > 0 ? (
                                tableData.map((row) => {
                                    const info = row.photographerinfo || {};

                                    return (
                                        <li
                                            key={row.userId}
                                            className="flex items-center gap-2 px-3 py-3 min-[400px]:gap-3 min-[400px]:px-4"
                                        >
                                            <div className="flex w-7 shrink-0 justify-center">
                                                <RenderMedal rank={row.ranking} />
                                            </div>

                                            <img
                                                src={info.image}
                                                alt={info.name || 'Photographer'}
                                                loading="lazy"
                                                decoding="async"
                                                className="aspect-square h-10 w-10 shrink-0 rounded-full object-cover shadow-sm min-[400px]:h-11 min-[400px]:w-11"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-titleText">
                                                    {info.name}
                                                </p>
                                                <p className="truncate text-xs text-subTitleText">
                                                    {row.city}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-bold text-titleText">
                                                    {(row.vots ?? 0).toLocaleString()}
                                                    <span className="ml-1 text-[10px] font-medium text-subTitleText">
                                                        votes
                                                    </span>
                                                </p>
                                                <p className="text-xs text-subTitleText">
                                                    {(row.point ?? 0).toLocaleString()} pts
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="px-4 py-8 text-center text-xs text-subTitleText">
                                    No photographers found for this category.
                                </li>
                            )}
                        </ul>

                        {/* Tablet, Laptop & Desktop: Table (md and up) */}
                        <div className="hidden w-full overflow-x-auto md:block">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr
                                        className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-subTitleText 2xl:text-sm"
                                        style={{
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        <th className="w-14 px-3 py-4 text-center lg:w-16 lg:px-6 2xl:w-20">
                                            #
                                        </th>
                                        <th className="px-3 py-4 lg:px-6">Photographer</th>
                                        <th className="px-3 py-4 lg:px-6">City</th>
                                        <th className="px-3 py-4 text-right lg:px-6">Votes</th>
                                        <th className="px-3 py-4 text-right lg:px-6">Points</th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm 2xl:text-base">
                                    {tableData.length > 0 ? (
                                        tableData.map((row) => {
                                            const info = row.photographerinfo || {};

                                            return (
                                                <tr
                                                    key={row.userId}
                                                    className="transition-colors hover:bg-slate-50/80"
                                                    style={{
                                                        borderBottom:
                                                            '1px solid rgba(0, 0, 0, 0.1)',
                                                    }}
                                                >
                                                    <td className="px-3 py-3 text-center lg:px-6 lg:py-4">
                                                        <RenderMedal rank={row.ranking} />
                                                    </td>

                                                    <td className="px-3 py-3 lg:px-6 lg:py-4">
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <img
                                                                src={info.image}
                                                                alt={info.name || 'Photographer'}
                                                                loading="lazy"
                                                                decoding="async"
                                                                className="aspect-square h-8 w-8 shrink-0 rounded-full object-cover shadow-sm lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
                                                            />
                                                            <span className="max-w-[140px] truncate font-semibold text-titleText lg:max-w-[260px] 2xl:max-w-[360px]">
                                                                {info.name}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="max-w-[120px] truncate px-3 py-3 font-medium text-subTitleText lg:max-w-[220px] lg:px-6 lg:py-4 2xl:max-w-[320px]">
                                                        {row.city}
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-3 text-right font-bold text-titleText lg:px-6 lg:py-4">
                                                        {(row.vots ?? 0).toLocaleString()}
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-subTitleText lg:px-6 lg:py-4">
                                                        {(row.point ?? 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-sm text-subTitleText"
                                            >
                                                No photographers found for this category.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}