import React from 'react';
import { NavLink, useParams } from 'react-router';

const PhotographerNavTabs = ({ isDashboard = false }) => {
  const { id } = useParams();

  // isDashboard true hole dashboard route ebong false hole normal route hobe
  const basePath = isDashboard 
    ? `/userDashboard/photographers/${id}` 
    : `/photographers/${id}`;

  return (
    <div className="max-w-[500px] bg-[#FAFAFA] p-3 rounded border border-gray-200/70 shadow-sm mt-6">
      <div className="flex items-center gap-8 overflow-x-auto scrollbar-none text-sm font-medium px-2">
        
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