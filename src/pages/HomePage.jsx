import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import Testimonials from '../components/home/Testimonials';
import Platform from '../components/home/Platform';
import MonthlyWinners from '../components/home/MonthlyWinners';
import HowItWorks from '../components/shared/HowItWorks';
import AlbumTypes from '../components/shared/AlbumTypes';
import TopPhotographersSection from '../components/shared/TopPhotographersSection';

const HomePage = () => {
    return (
        <div>
            <Hero/>
            <StatsSection/>
            <AlbumTypes/>

            <HowItWorks  />

            <TopPhotographersSection/>
            
            <MonthlyWinners/>
            <Platform/>
            <Testimonials/>
        </div>
    );
};

export default HomePage;