import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import AnnouncementBar from '../components/shared/AnnouncementBar';
import Newsletter from '../components/shared/Newsletter';
import AdvertisingBanner from '../components/shared/AdvertisingBanner';

//  
const MainLayout = () => {
    return (
        <div>
            <AnnouncementBar/>
            <Navbar/>
            <main className='min-h-screen'>
                <Outlet />
            </main>
            <AdvertisingBanner/>
            <Newsletter/>
            <Footer/>
        </div>
    );
};

export default MainLayout;