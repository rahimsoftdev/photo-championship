import React from 'react';
import {
  FiUpload,
  FiAward,
  FiCamera,
  FiHeart,
  FiDollarSign,
  FiCompass,
  FiArrowRight,
  FiUsers,
  FiClock
} from 'react-icons/fi';
import { Link } from 'react-router';

export default function HomePageDhshboard() {
  // TODO: add real data - User Profile & Overview Info
  const userInfo = {
    name: 'Sarah Jenkins',
    growthRate: '12%',
    activeCompetitionsCount: 3,
  };

  // TODO: add real data - Stats Cards List
  const statsData = [
    {
      id: 1,
      title: 'CURRENT RANK',
      value: '#42',
      icon: <FiAward className="text-amber-500 text-lg" />,
      iconBg: 'bg-amber-100',
    },
    {
      id: 2,
      title: 'TOTAL PHOTOS',
      value: '156',
      icon: <FiCamera className="text-purple-600 text-lg" />,
      iconBg: 'bg-purple-100',
    },
    {
      id: 3,
      title: 'TOTAL VOTES',
      value: '1.2k',
      icon: <FiHeart className="text-indigo-600 text-lg" />,
      iconBg: 'bg-indigo-100',
    },
    {
      id: 4,
      title: 'PRIZES WON',
      value: '$2,450',
      icon: <FiDollarSign className="text-amber-600 text-lg" />,
      iconBg: 'bg-amber-100',
    },
    {
      id: 5,
      title: 'COMPETITIONS',
      value: '8',
      icon: <FiCompass className="text-purple-600 text-lg" />,
      iconBg: 'bg-purple-100',
    },
  ];

  // TODO: add real data - Participating Competitions List
  const competitionsData = [
    {
      id: 'art_001',
      title: 'Celestial Wonders 2024',
      badge: 'Top 5%',
      badgeType: 'warning',
      participants: '4,231',
      timeText: 'Ends in 2 days',
      statusText: 'Your Submission',
      rankResult: '#14th Place',
      rankColor: 'text-secondary font-bold',
      thumbnail: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'art_002',
      title: 'Urban Rhythms: Neon Nights',
      badge: 'In Review',
      badgeType: 'neutral',
      participants: '1,120',
      timeText: 'Voting starts tomorrow',
      statusText: 'Your Submission',
      rankResult: 'Pending...',
      rankColor: 'text-gray-700 font-semibold',
      thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'art_003',
      title: 'The Human Story: Portraiture',
      badge: 'Winner',
      badgeType: 'success',
      participants: '890',
      timeText: 'Completed Dec 12',
      statusText: 'Final Standing',
      rankResult: '🏆 1st Place',
      rankColor: 'text-amber-600 font-bold',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    },
  ];
  const badgeStyles = {
    warning: 'bg-amber-100 text-amber-700',
    success: 'bg-orange-100 text-orange-700',
    neutral: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div
        className="bg-[#2A303D] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{ boxShadow: '0px 1px 2px 0px #0000000D' }}
      >
        <div className="max-w-xl space-y-3">
          <h1 className="text-sm sm:text-lg lg:text-2xl font-bold tracking-tight">
            Welcome back, {userInfo.name}
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm  leading-relaxed">
            Your portfolio has grown by {userInfo.growthRate} in views this week. You have{' '}
            {userInfo.activeCompetitionsCount} active competitions ending soon.
          </p>
          <div className="pt-2">
            <Link to={'/user-dashboard/artwork-management/UploadArtWorkTypes'} className="bg-secondary text-white px-2 md:px-5 py-1.5 md:py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity max-w-[220px]">
              <FiUpload size={16} />
              <span>Upload New Photo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-3 md:p-5 rounded-2xl flex flex-col justify-between border border-gray-100"
            style={{ boxShadow: '0px 1px 2px 0px #0000000D' }}
          >
            <div className={`w-5 h-5 sm:h-11 sm:w-11  p-1 rounded-lg ${stat.iconBg} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Participating Competitions Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Participating Competitions
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Current progress in your active contests
            </p>
          </div>
          <Link to={'/user-dashboard/artwork-management'} className="text-secondary text-xs font-semibold flex items-center gap-1 hover:underline">
            <span>View All My Competitions</span>
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Competitions List */}
        <div className="space-y-4 pt-2 max-sm:pt-5">
          {competitionsData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0 sm:gap-4 border border-gray-100 transition-all hover:border-gray-200 sm:p-4"
              style={{ boxShadow: '0px 1px 2px 0px #0000000D' }}
            >
              {/* Left Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto sm:flex-1 min-w-0">
                {/* Thumbnail: mobile e full width card image, sm+ e choto thumbnail */}
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                  className="w-full aspect-[16/9] sm:aspect-auto sm:w-28 sm:h-20 md:w-32 md:h-20 sm:rounded-xl object-cover shrink-0"
                />

                <div className="space-y-2 sm:space-y-1 px-4 sm:px-0 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base sm:text-sm font-bold text-gray-900 break-words">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${badgeStyles[item.badgeType] || badgeStyles.neutral
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FiUsers size={13} className="shrink-0" /> {item.participants} Participants
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={13} className="shrink-0" /> {item.timeText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Rank & Action Button */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-3 sm:mt-0 px-4 py-3 sm:p-0 border-t sm:border-t-0 border-gray-100">
                <div className="text-left sm:text-right min-w-0">
                  <p className="text-[11px] text-gray-400">{item.statusText}</p>
                  <p className={`text-sm ${item.rankColor} break-words`}>{item.rankResult}</p>
                </div>

                <Link
                  to={`/user-dashboard/artwork-management/${item.id}`}
                  className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-600 flex items-center justify-center transition-colors shrink-0"
                  aria-label={`View details of ${item.title}`}
                >
                  <FiArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}