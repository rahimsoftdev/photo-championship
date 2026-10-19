import React from 'react';
import { useOutletContext } from 'react-router';
import { FaGlobe, FaInstagram, FaTwitter, FaPlay, FaInfoCircle } from 'react-icons/fa';
import { HiCamera } from 'react-icons/hi';

const ProfileTab = () => {
  const { user } = useOutletContext();

  // Jodi stats ba socialLinks missing thake tar fallback
  const stats = user?.stats || {
    followers: 1260,
    following: 120,
    profileViews: 2560,
    totalArtworks: 24,
    competitionEntries: 2,
    totalLove: 4320
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* 1. Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 py-4 border-b border-gray-100 text-center">
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.followers}</p>
          <p className="text-xs text-gray-500 mt-0.5">Followers</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.following}</p>
          <p className="text-xs text-gray-500 mt-0.5">Following</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.profileViews || stats.profileVisitor || 2560}</p>
          <p className="text-xs text-gray-500 mt-0.5">Profile Visitor</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalArtworks}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Artwork</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.competitionEntries}</p>
          <p className="text-xs text-gray-500 mt-0.5">Competition Entries</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalLove || stats.totalHearts || 4320}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Hearts</p>
        </div>
      </div>

      {/* 2. About & Biography Section */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">About & Biography</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {user?.about || "I'm a passionate photographer who loves turning real moments into timeless visual stories. With a strong eye for detail, composition, and natural emotions, I focus on creating photographs that feel authentic, beautiful, and meaningful. From portraits and weddings to lifestyle and special events, I enjoy capturing the moments that people want to remember forever. My goal is not just to take a photograph, but to tell a story through every frame."}
        </p>

        {/* Social Links / Website Links */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-primary">
          <a href={user?.socialLinks?.website || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
            <FaGlobe className="text-gray-400" />
            <span>{user?.socialLinks?.website ? user.socialLinks.website.replace('https://', '') : "www.elenavancephotography.com"}</span>
          </a>
          <a href={user?.socialLinks?.instagram || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
            <FaInstagram className="text-gray-400" />
            <span>{user?.username ? `@${user.username}_photo` : "@elenavance_photo"}</span>
          </a>
          <a href={user?.socialLinks?.twitter || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
            <FaTwitter className="text-gray-400" />
            <span>{user?.username ? `@${user.username}` : "@elenavance"}</span>
          </a>
        </div>
      </div>

      {/* 3. Intro Video Section */}
      <div className="relative w-full h-[280px] sm:h-[360px] rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-gray-900">
        <img 
          src={user?.coverPhoto || "https://picsum.photos/seed/intro-video/1200/500"} 
          alt="Intro Video Cover" 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition transform group-hover:scale-110">
            <FaPlay className="text-gray-900 text-xl sm:text-2xl ml-1" />
          </div>
        </div>
      </div>

      {/* 4. Talent Appreciation Section */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">Talent Appreciation</h3>
            <FaInfoCircle className="text-gray-400 text-xs cursor-pointer" />
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">
          Recognize a photographer whose talent inspires you. Each week, you can award one Gold, one Silver, and one Bronze Photo Camera.
        </p>

        {/* Appreciation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Gold Card */}
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center relative">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-3 border border-amber-100 shadow-sm">
              <HiCamera className="text-amber-500 text-2xl" />
            </div>
            <span className="text-[10px] tracking-wider font-bold text-amber-600 uppercase mb-0.5">GOLD</span>
            <p className="text-xl font-bold text-gray-900">24</p>
            <span className="text-[11px] text-gray-400 mb-4">awards</span>
            <button className="w-full py-2.5 bg-[#FFF9E6] hover:bg-[#FFF3CD] text-amber-800 rounded-lg text-xs font-semibold transition border border-amber-200/60 shadow-sm">
              + Give Gold
            </button>
          </div>

          {/* Silver Card */}
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center relative">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 border border-blue-100 shadow-sm">
              <HiCamera className="text-blue-500 text-2xl" />
            </div>
            <span className="text-[10px] tracking-wider font-bold text-blue-600 uppercase mb-0.5">SILVER</span>
            <p className="text-xl font-bold text-gray-900">17</p>
            <span className="text-[11px] text-gray-400 mb-4">awards</span>
            <button disabled className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-medium cursor-not-allowed border border-gray-200">
              ✓ Already awarded this week
            </button>
          </div>

          {/* Bronze Card */}
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-5 flex flex-col items-center text-center relative">
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-emerald-50"></div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 border border-orange-100 shadow-sm">
              <HiCamera className="text-orange-600 text-2xl" />
            </div>
            <span className="text-[10px] tracking-wider font-bold text-orange-600 uppercase mb-0.5">BRONZE</span>
            <p className="text-xl font-bold text-gray-900">10</p>
            <span className="text-[11px] text-gray-400 mb-4">awards</span>
            <button className="w-full py-2.5 bg-[#FFF4EE] hover:bg-[#FFE8DE] text-orange-800 rounded-lg text-xs font-semibold transition border border-orange-200/60 shadow-sm">
              + Give Bronze
            </button>
          </div>

        </div>

        {/* Bottom Weekly Status Bar */}
        <div className="mt-5 bg-[#FAFAFA] border border-gray-200/80 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <p className="text-gray-400 font-medium">YOUR WEEKLY APPRECIATION</p>
            <p className="text-gray-800 font-semibold mt-0.5">🟡 Gold: <span className="text-gray-500 font-normal">1 remaining</span></p>
          </div>
          <div>
            <p className="text-gray-400 font-medium">&nbsp;</p>
            <p className="text-gray-800 font-semibold mt-0.5">⚪ Silver: <span className="text-gray-500 font-normal">0 remaining</span></p>
          </div>
          <div className="sm:text-right">
            <p className="text-gray-400 font-medium">&nbsp;</p>
            <p className="text-gray-800 font-semibold mt-0.5">🟠 Bronze: <span className="text-gray-500 font-normal">0 remaining</span></p>
            <p className="text-[10px] text-gray-400 mt-1">Resets in 4 days</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfileTab;