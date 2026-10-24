import { Outlet } from 'react-router';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import AnnouncementBar from '../components/shared/AnnouncementBar';
import Newsletter from '../components/shared/Newsletter';
import AdvertisingBanner from '../components/shared/AdvertisingBanner';
import ScrollToTop from '../components/shared/ScrollToTop';

//  
const MainLayout = () => {
    return (
        <div>
            <ScrollToTop />
            <AnnouncementBar />
            <Navbar />
            <main className=''>
                <Outlet />
            </main>
            <AdvertisingBanner />
            <Newsletter />
            <Footer />
        </div>
    );
};

export default MainLayout;