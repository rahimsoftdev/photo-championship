import React from 'react';
import { NavLink, useParams, useLocation } from 'react-router';

const PhotographerNavTabs = () => {
  const { id } = useParams();
  const location = useLocation();

  // URL e 'user-dashboard' thakle dashboard route, noyto normal route hobe
  const isDashboard = location.pathname.includes('user-dashboard');

  const basePath = isDashboard 
    ? `/user-dashboard/photographers/${id}` 
    : `/photographers/${id}`;

  return (
    <div className="max-w-[500px] bg-[#FAFAFA] p-3 rounded-xl border border-gray-200/70 shadow-xs mt-6">
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-none text-xs sm:text-sm font-medium px-2">
        
        {/* Profile Tab */}
        <NavLink 
          end
          to={basePath}
          className={({ isActive }) => 
            `pb-2.5 relative transition whitespace-nowrap ${
              isActive ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              Profile
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-full"></span>
              )}
            </>
          )}
        </NavLink>

        {/* My Artwork Tab */}
        <NavLink 
          to={`${basePath}/artworks`}
          className={({ isActive }) => 
            `pb-2.5 relative transition whitespace-nowrap ${
              isActive ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              My Artwork
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-full"></span>
              )}
            </>
          )}
        </NavLink>

        {/* My Store Tab */}
        <NavLink 
          to={`${basePath}/store`}
          className={({ isActive }) => 
            `pb-2.5 relative transition whitespace-nowrap ${
              isActive ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              My Store
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-full"></span>
              )}
            </>
          )}
        </NavLink>

        {/* Premium Photos Tab */}
        <NavLink 
          to={`${basePath}/premium-photos`}
          className={({ isActive }) => 
            `pb-2.5 relative transition whitespace-nowrap ${
              isActive ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              Premium Photos
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-full"></span>
              )}
            </>
          )}
        </NavLink>

        {/* Posts Tab */}
        <NavLink 
          to={`${basePath}/posts`}
          className={({ isActive }) => 
            `pb-2.5 relative transition whitespace-nowrap ${
              isActive ? 'text-primary font-semibold' : 'text-gray-500 hover:text-gray-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              Posts
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-full"></span>
              )}
            </>
          )}
        </NavLink>

      </div>
    </div>
  );
};

export default PhotographerNavTabs;