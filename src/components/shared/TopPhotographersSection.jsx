import React, { useState } from 'react';
import { useTopPhotographers } from '../../hooks/useTopPhotographers';

export default function TopPhotographersSection() {
    // Plain state use kora holo router chara filter korar jonno (default 'six')
    const [selectedType, setSelectedType] = useState('six');

    // Pass selected type to the clean hook
    const { isLoading, error, data } = useTopPhotographers(selectedType);



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

        <section className="w-full bg-[#f8fafc] px-4 py-10 font-sans min-[350px]:px-4 sm:px-6 sm:py-12 md:px-8 lg:py-section">
            <div className="mx-auto max-w-main space-y-8 sm:space-y-10 md:space-y-12">

                {/* Header & Filter Nav */}
                <div className="flex min-w-0 flex-col justify-between gap-5 lg:flex-row md:items-center md:gap-6">
                    <div className="min-w-0">
                        <h1 className="break-words text-2xl font-extrabold tracking-tight text-titleText min-[350px]:text-3xl ">
                            Top Photographers
                        </h1>
                        <p className="mt-1 text-xs text-subTitleText sm:text-sm md:text-base">
                            July 2026 — Live standings
                        </p>
                    </div>

                    {/* Filter Controls */}

                    <div className="flex w-full max-w-full flex-wrap items-center gap-1.5 rounded-2xl bg-slate-200/50 p-1.5 min-[350px]:gap-2 sm:w-fit sm:rounded-full">
                        <button
                            onClick={() => setSelectedType("single")}
                            className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${selectedType === "single"
                                ? "bg-primary text-white shadow-md"
                                : "text-subTitleText hover:text-titleText"
                                }`}
                        >
                            Single Photo
                        </button>

                        <button
                            onClick={() => setSelectedType("six")}
                            className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${selectedType === "six"
                                ? "bg-primary text-white shadow-md"
                                : "text-subTitleText hover:text-titleText"
                                }`}
                        >
                            6 Photos
                        </button>

                        <button
                            onClick={() => setSelectedType("twelve")}
                            className={`rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-4 sm:text-sm ${selectedType === "twelve"
                                ? "bg-primary text-white shadow-md"
                                : "text-subTitleText hover:text-titleText"
                                }`}
                        >
                            12 Photos - Full Zodiac Story
                        </button>
                    </div>

                </div>

                {/* Podium Section */}
                {podiumOrder.length > 0 && (
                    <div className="flex items-end justify-center gap-2 overflow-x-auto px-1 pb-2 pt-5 min-[350px]:gap-3 sm:gap-6 md:gap-10">
                        {podiumOrder.map((photographer) => {
                            const isFirst = photographer.ranking === 1;

                            return (
                                <div
                                    key={photographer.userId}
                                    className={`flex min-w-0 shrink-0 flex-col items-center text-center transition-transform ${isFirst
                                            ? "-translate-y-2 scale-105 sm:-translate-y-3"
                                            : "scale-95"
                                        }`}
                                >
                                    <div className="relative mb-1.5 sm:mb-2">
                                        <div className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 sm:-top-3">
                                            <RenderMedal rank={photographer.ranking} />
                                        </div>

                                        <div
                                            className={`rounded-full p-0.5 sm:p-1 ${isFirst
                                                    ? "ring-2 ring-[#FDC700] sm:ring-4"
                                                    : "ring-1 ring-slate-300 sm:ring-2"
                                                }`}
                                        >
                                            <img
                                                src={photographer.photographerinfo.image}
                                                alt={photographer.photographerinfo.name}
                                                className={`rounded-full object-cover shadow-lg ${isFirst
                                                        ? "h-12 w-12 min-[350px]:h-14 min-[350px]:w-14 sm:h-20 sm:w-20 md:h-24 md:w-24"
                                                        : "h-9 w-9 min-[350px]:h-11 min-[350px]:w-11 sm:h-14 sm:w-14 md:h-16 md:w-16"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <h3 className="max-w-20 break-words text-[10px] font-bold text-titleText min-[350px]:text-xs sm:max-w-28 sm:text-sm md:text-base">
                                        {photographer.photographerinfo.name.split(" ")[0]}
                                    </h3>

                                    <p className="mb-0.5 max-w-20 break-words text-[9px] text-subTitleText min-[350px]:text-[10px] sm:mb-1 sm:max-w-28 sm:text-xs">
                                        {photographer.city}
                                    </p>

                                    <p className="whitespace-nowrap text-[9px] font-bold text-secondary min-[350px]:text-[10px] sm:text-xs md:text-sm">
                                        {photographer.vots.toLocaleString()} votes
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Main Leaderboard Table */}
                <div
                    className="overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl"
                    style={{ border: "1px solid rgba(0, 0, 0, 0.2)" }}
                >
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[600px] border-collapse text-left">
                            <thead>
                                <tr
                                    className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-subTitleText sm:text-xs"
                                    style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.2)" }}
                                >
                                    <th className="w-12 px-3 py-3 text-center sm:w-16 sm:px-6 sm:py-4">
                                        #
                                    </th>
                                    <th className="px-3 py-3 sm:px-6 sm:py-4">
                                        Photographer
                                    </th>
                                    <th className="px-3 py-3 sm:px-6 sm:py-4">
                                        City
                                    </th>
                                    <th className="px-3 py-3 text-right sm:px-6 sm:py-4">
                                        Votes
                                    </th>
                                    <th className="px-3 py-3 text-right sm:px-6 sm:py-4">
                                        Points
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y text-xs sm:text-sm">
                                {tableData.length > 0 ? (
                                    tableData.map((row) => (
                                        <tr
                                            key={row.userId}
                                            className="transition-colors hover:bg-slate-50/80"
                                            style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
                                        >
                                            <td className="px-3 py-3 text-center sm:px-6 sm:py-4">
                                                <RenderMedal rank={row.ranking} />
                                            </td>

                                            <td className="px-3 py-3 sm:px-6 sm:py-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <img
                                                        src={row.photographerinfo.image}
                                                        alt={row.photographerinfo.name}
                                                        className="h-7 w-7 shrink-0 rounded-full object-cover shadow-sm sm:h-8 sm:w-8"
                                                    />
                                                    <span className="font-semibold text-titleText">
                                                        {row.photographerinfo.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-3 py-3 font-medium text-subTitleText sm:px-6 sm:py-4">
                                                {row.city}
                                            </td>

                                            <td className="px-3 py-3 text-right font-bold text-titleText sm:px-6 sm:py-4">
                                                {row.vots.toLocaleString()}
                                            </td>

                                            <td className="px-3 py-3 text-right font-medium text-subTitleText sm:px-6 sm:py-4">
                                                {row.point.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-xs text-subTitleText sm:text-sm"
                                        >
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