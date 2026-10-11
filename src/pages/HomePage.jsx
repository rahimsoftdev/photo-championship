import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import Testimonials from '../components/home/Testimonials';
import Platform from '../components/home/Platform';
import MonthlyWinners from '../components/home/MonthlyWinners';

const HomePage = () => {
    return (
        <div>
            <Hero/>

            <StatsSection/>
            
            <MonthlyWinners/>
            <Platform/>
            <Testimonials/>
        </div>
    );
};

export default HomePage;