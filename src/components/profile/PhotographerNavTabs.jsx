import React from "react";
import { NavLink, useParams, useLocation } from "react-router";

// Tab list: notun tab lagle ekhane ekta line add korlei hobe
const TABS = [
  { label: "Profile", path: "", end: true },
  { label: "My Artwork", path: "/artworks" },
  { label: "My Store", path: "/store" },
  { label: "Premium Photos", path: "/premium-photos" },
  { label: "Posts", path: "/posts" },
];

const PhotographerNavTabs = () => {
  const { id } = useParams();
  const { pathname } = useLocation();

  // URL theke base path ber kore: ".../photographers/<id>" porjonto
  // /admin-dashboard/photographers/user_102/store -> /admin-dashboard/photographers/user_102
  // /user-dashboard/photographers/user_102        -> /user-dashboard/photographers/user_102
  // /photographers/user_102/posts                 -> /photographers/user_102
  const match = pathname.match(/^(.*?\/photographers\/[^/]+)/);
  const basePath = match ? match[1] : `/photographers/${id}`;

  return (
    <div className="mt-6 w-full max-w-full rounded-xl border border-gray-200/70 bg-[#FAFAFA] p-3 shadow-xs sm:max-w-[560px]">
      <div className="scrollbar-none flex items-center gap-5 overflow-x-auto px-2 text-xs font-medium sm:gap-8 sm:text-sm">
        {TABS.map((tab) => (
          <NavLink
            key={tab.label}
            end={tab.end}
            to={`${basePath}${tab.path}`}
            className={({ isActive }) =>
              `relative whitespace-nowrap pb-2.5 transition ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-gray-500 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-t-full bg-primary"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default PhotographerNavTabs;