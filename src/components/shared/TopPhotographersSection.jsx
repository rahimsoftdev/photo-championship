import React, { useState } from 'react';
import { useTopPhotographers } from '../../hooks/useTopPhotographers';

export default function TopPhotographersSection() {
    // Plain state use kora holo router chara filter korar jonno (default 'six')
    const [selectedType, setSelectedType] = useState('six');

    // Pass selected type to the clean hook
    const { isLoading, error, data } = useTopPhotographers(selectedType);

    if (isLoading) {
        return <div className="py-20 text-center text-subTitleText">Loading top photographers...</div>;
    }

    if (error) {
        return <div className="py-20 text-center text-red-500">Error: {error}</div>;
    }

    const topThree = data.slice(0, 3);
    const tableData = data;

    // Helper ranking badge component
    const RenderMedal = ({ rank }) => {
        if (rank === 1) {
            return (
                <span
                    className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full text-black shadow-sm"
                    style={{ backgroundColor: '#FDC700' }}
                >
                    1
                </span>
            );
        }
        if (rank === 2) {
            return (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-slate-300 text-slate-800 shadow-sm">
                    2
                </span>
            );
        }
        if (rank === 3) {
            return (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-amber-600 text-white shadow-sm">
                    3
                </span>
            );
        }
        return <span className="text-subTitleText font-medium text-sm">{rank}</span>;
    };

    // Reorder top 3 for podium layout: [Rank 2, Rank 1, Rank 3]
    const podiumOrder = [];
    if (topThree[1]) podiumOrder.push(topThree[1]);
    if (topThree[0]) podiumOrder.push(topThree[0]);
    if (topThree[2]) podiumOrder.push(topThree[2]);

    return (
        <section className="w-full bg-[#f8fafc] py-section px-4 sm:px-8 font-sans">
            <div className="max-w-main mx-auto space-y-12">

                {/* Header & Filter Nav */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-titleText tracking-tight">
                            Top Photographers
                        </h1>
                        <p className="text-subTitleText text-sm mt-1">
                            July 2026 — Live standings
                        </p>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-slate-200/50 p-1.5 rounded-full">
                        <button
                            onClick={() => setSelectedType('single')}
                            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                                selectedType === 'single'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-subTitleText hover:text-titleText'
                            }`}
                        >
                            Single Photo
                        </button>
                        <button
                            onClick={() => setSelectedType('six')}
                            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                                selectedType === 'six'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-subTitleText hover:text-titleText'
                            }`}
                        >
                            6 Photos
                        </button>
                        <button
                            onClick={() => setSelectedType('twelve')}
                            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                                selectedType === 'twelve'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-subTitleText hover:text-titleText'
                            }`}
                        >
                            12 Photos - Full Zodiac Story
                        </button>
                    </div>
                </div>

                {/* Podium Section (Top 3 Showcase) */}
                {podiumOrder.length > 0 && (
                    <div className="flex items-end justify-center gap-6 sm:gap-12 pt-6 pb-2">
                        {podiumOrder.map((photographer) => {
                            const isFirst = photographer.ranking === 1;
                            return (
                                <div
                                    key={photographer.userId}
                                    className={`flex flex-col items-center text-center transition-transform ${
                                        isFirst ? '-translate-y-4 scale-105' : 'scale-95'
                                    }`}
                                >
                                    <div className="relative mb-2">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                            <RenderMedal rank={photographer.ranking} />
                                        </div>

                                        <div
                                            className={`rounded-full p-1 ${
                                                isFirst ? 'ring-4 ring-[#FDC700]' : 'ring-2 ring-slate-300'
                                            }`}
                                        >
                                            <img
                                                src={photographer.photographerinfo.image}
                                                alt={photographer.photographerinfo.name}
                                                className={`${
                                                    isFirst ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14 sm:w-16 sm:h-16'
                                                } rounded-full object-cover shadow-lg`}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-titleText text-sm sm:text-base">
                                        {photographer.photographerinfo.name.split(' ')[0]}
                                    </h3>
                                    <p className="text-xs text-subTitleText mb-1">
                                        {photographer.city}
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-secondary">
                                        {photographer.vots.toLocaleString()} votes
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Main Leaderboard Table */}
                <div
                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                    style={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr
                                    className="text-[11px] font-bold text-subTitleText uppercase tracking-wider bg-slate-50/50"
                                    style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}
                                >
                                    <th className="py-4 px-6 w-16 text-center">#</th>
                                    <th className="py-4 px-6">Photographer</th>
                                    <th className="py-4 px-6">City</th>
                                    <th className="py-4 px-6 text-right">Votes</th>
                                    <th className="py-4 px-6 text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {tableData.length > 0 ? (
                                    tableData.map((row) => (
                                        <tr
                                            key={row.userId}
                                            className="hover:bg-slate-50/80 transition-colors"
                                            style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}
                                        >
                                            <td className="py-4 px-6 text-center">
                                                <RenderMedal rank={row.ranking} />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={row.photographerinfo.image}
                                                        alt={row.photographerinfo.name}
                                                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                                                    />
                                                    <span className="font-semibold text-titleText">
                                                        {row.photographerinfo.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-subTitleText font-medium">
                                                {row.city}
                                            </td>
                                            <td className="py-4 px-6 text-right font-bold text-titleText">
                                                {row.vots.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-right text-subTitleText font-medium">
                                                {row.point.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-subTitleText">
                                            No photographers found for this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
}