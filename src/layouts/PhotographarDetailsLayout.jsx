import React from 'react';
import { useParams, Outlet } from 'react-router';
import { useUser } from '../hooks/useUser';
// import PhotographerHeader from '../components/PhotographerHeader';
import LoadingPage from '../pages/feedback/LoadingPage';
import PhotographerHeader from '../components/profile/PhotographerHeader';
import PhotographerNavTabs from '../components/profile/PhotographerNavTabs';
import PhotographerDetailsSkeleton from '../components/ui/Skeletons/PhotographerDetailsSkeleton';

const PhotographarDetailsLayout = () => {
  const { id } = useParams();
  const { user, loading, error } = useUser(id);

  if (loading) return <PhotographerDetailsSkeleton/>
  if (error || !user) return <div className="text-center p-8">User not found</div>;

  return (
    <div className="max-w-main mx-auto px-4 pt-5 sm:pt-12 lg:pt-15">
      {/* Photographer Header Component */}
      <PhotographerHeader user={user} />
      <PhotographerNavTabs/>

      {/* Dynamic Tabs & Outlet */}
      <div className="mt-4 lg:mt-11">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default PhotographarDetailsLayout;