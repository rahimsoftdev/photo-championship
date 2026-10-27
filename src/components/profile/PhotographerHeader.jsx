import React, { useState } from 'react';
import { FaUserPlus, FaUserCheck, FaCommentDots, FaMapMarkerAlt } from 'react-icons/fa';
import { getSavedUserInfo } from '../../utils/getUserInof';

const PhotographerHeader = ({ user, isDashboard }) => {
  if (!user) return null;
  const [follow, setFollow] = useState(isDashboard);
  const userInfo = getSavedUserInfo()
  // console.log(user.id, 'user', userInfo.id)

  return (
    <div className="w-full relative md:pb-2 pb-4">
      {/* 1. Cover Photo Container */}
      <div className="w-full h-[120px] sm:h-[220px] md:h-[270px] lg:h-[360px] xl:h-[400px]  rounded-2xl overflow-hidden bg-gray-200">
        <img
          src={user.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. Profile Info Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between px-4 sm:px-6 -mt-14 sm:-mt-16 gap-4 relative z-10">

        {/* Left Side: Profile Photo & Text Info */}
        <div className="flex flex-col lg:flex-row sm:items-end gap-4">
          {/* Circular Profile Photo overlapping cover */}
          <div className="w-20 h-20 sm:w-25 sm:h-25 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-white">
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name, Username, Title & Country */}
          <div className="flex flex-col justify-end pb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {user.name}
            </h2>

            <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-gray-500 mt-1">
              <span>@{user.username}</span>
              {user.title && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-600 font-medium">{user.title}</span>
                </>
              )}
              {user.country && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <FaMapMarkerAlt className="text-gray-400 text-xs" />
                    {user.country}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Follow & Message Action Buttons */}

        {
          user.id !== userInfo.id &&(
            <div className="flex items-center gap-2.5 sm:mb-2">
              {/* Follow Button with Toggle state & Green color on active */}
              <button
                onClick={() => setFollow(!follow)}
                className={`flex items-center gap-2 px-5 py-1.5 sm:py-2.5 rounded-lg text-sm font-medium transition shadow-sm text-white ${follow ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:opacity-90'
                  }`}
              >
                {follow ? <FaUserCheck className="text-xs" /> : <FaUserPlus className="text-xs" />}
                <span>{follow ? 'Following' : 'Follow'}</span>
              </button>

              {/* Message Button */}
              <button className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-5 py-1.5 sm:py-2.5 rounded-lg text-sm font-medium transition shadow-sm">
                <FaCommentDots className="text-xs" />
                <span>Message</span>
              </button>
            </div>
          )
        }


      </div>
    </div>
  );
};

export default PhotographerHeader;