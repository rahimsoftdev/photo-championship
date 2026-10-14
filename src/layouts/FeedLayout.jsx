
import React from "react";
import { Outlet } from "react-router";
import AlbumSidebar from "../components/shared/AlbumSidebar";
import SearchBar from "../components/ui/SearchBar";
import Pagination from "../components/shared/Pagination";

const FeedLayout = () => {
  return (
    <main className="mx-auto w-full max-w-main px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 lg:gap-16">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-[220px] lg:w-[238px]">
          <AlbumSidebar />
        </aside>

        {/* Main content */}
        <section className="min-w-0 flex-1">
          {/* Page heading and search */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mb-7">
            <h1 className="shrink-0 text-2xl font-bold tracking-tight text-[#171D2B] sm:text-[26px] lg:text-[28px]">
              Competitions Showcase
            </h1>

            <div className="w-full sm:max-w-[420px] sm:flex-1">
              <SearchBar bgColor="#F5F6F8" width="100%" />
            </div>
          </div>

          {/* Nested page content */}
          <Outlet />


          {/* pagination  */}
          <Pagination/>
        </section>
      </div>
    </main>
  );
};

export default FeedLayout;
