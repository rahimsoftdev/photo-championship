import { useState } from "react";
import { useSearchParams } from "react-router";
import { FiAlertCircle, FiCalendar, FiMapPin, FiStar, FiUser, FiUserCheck } from "react-icons/fi";
import { useUsers } from "../../hooks/useUsers";
import { Pagination } from "@heroui/react";
// import { useUsers } from "../../hooks/useUsers";
// import Pagination from "../../components/Pagination"; // ⚠️ আপনার আসল পাথ বসান

const LIMIT = 8;

const compact = (n) => Number(n).toLocaleString("en-US");

const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });

const SkeletonCard = () => (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex gap-3">
            <div className="h-12 w-12 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
        </div>
        <div className="mt-4 h-12 rounded-lg bg-gray-100" />
        <div className="mt-3 h-8 rounded-lg bg-gray-100" />
        <div className="mt-3 h-14 rounded-lg bg-gray-100" />
        <div className="mt-4 flex gap-2">
            <div className="h-8 flex-1 rounded-lg bg-gray-200" />
            <div className="h-8 flex-1 rounded-lg bg-gray-200" />
        </div>
    </div>
);

const PhotographerCard = ({ user }) => {
    const [following, setFollowing] = useState(true); // ফেভারিট তালিকা, তাই শুরুতে Following

    return (
        <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* হেডার */}
            <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                    <img
                        src={user.profilePhoto}
                        alt={user.name}
                        loading="lazy"
                        className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-white">
                        <FiStar size={9} />
                    </span>
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-900">{user.name}</h3>
                    <p className="text-[11px] font-medium text-[#4048CD]">@{user.username}</p>
                    <p className="mt-0.5 truncate text-[11px] text-gray-500">{user.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
                        <FiMapPin size={10} /> {user.country}
                    </p>
                </div>
            </div>

            {/* বায়ো */}
            <p className="mt-4 line-clamp-2 min-h-[2.75rem] rounded-lg bg-gray-100 px-3 py-2.5 text-[11px] leading-snug text-gray-600">
                &ldquo;{user.bio}&rdquo;
            </p>

            {/* কবে follow করেছে */}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#EEF1FF] px-3 py-2 text-[11px] text-gray-600">
                <FiCalendar size={12} className="text-[#4048CD]" />
                Followed you: {fmtDate(user.joinedAt)}
            </div>

            {/* স্ট্যাটস */}
            <div className="mt-3 grid grid-cols-2 divide-x divide-gray-200 rounded-lg bg-gray-100 py-3 text-center">
                <div>
                    <p className="text-sm font-bold text-gray-900">{compact(user.stats.followers)}</p>
                    <p className="text-[10px] text-gray-500">Followers</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">{compact(user.stats.totalArtworks)}</p>
                    <p className="text-[10px] text-gray-500">Artworks</p>
                </div>
            </div>

            {/* বাটন */}
            <div className="mt-auto flex gap-2 pt-4">
                <button
                    type="button"
                    onClick={() => setFollowing((v) => !v)}
                    aria-pressed={following}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition ${following
                        ? "border-gray-200 bg-white text-[#4048CD] hover:bg-gray-50"
                        : "border-[#4048CD] bg-[#4048CD] text-white hover:bg-[#343cb5]"
                        }`}
                >
                    {following ? <FiUserCheck size={13} /> : <FiUser size={13} />}
                    {following ? "Following" : "Follow"}
                </button>

                {/* ⚠️ আপনার আসল প্রোফাইল রুট বসান */}
                <a
                    href={`/userDashboard/photographers/${user.id}`}
                    className="flex flex-1 items-center justify-center rounded-lg bg-gray-100 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-200"
                >
                    View Profile
                </a>
            </div>
        </article>
    );
};

const FavoritePhotographarPage = () => {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const { data, isLoading, error, totalPages } = useUsers(page, LIMIT);

    return (
        <div className="w-full pb-12">
            <h1 className="text-2xl font-bold text-gray-900">Favorite Photographers</h1>
            <p className="mt-1 text-xs text-gray-500">Photographers you follow and love.</p>

            {error && (
                <div
                    role="alert"
                    className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600"
                >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {error}
                </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {isLoading && Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}

                {!isLoading && !error && data.map((user) => <PhotographerCard key={user.id} user={user} />)}
            </div>

            {!isLoading && !error && data.length === 0 && (
                <p className="py-16 text-center text-sm text-gray-400">No photographers found.</p>
            )}

            {!isLoading && !error && <Pagination totalPages={totalPages} />}
        </div>
    );
};

export default FavoritePhotographarPage;