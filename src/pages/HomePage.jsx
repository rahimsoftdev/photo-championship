import React from 'react';
import SearchBar from '../components/ui/SearchBar';
import Hero from '../components/home/Hero';
import StatsSection from '../components/home/StatsSection';
import Testimonials from '../components/home/Testimonials';
import Platform from '../components/home/Platform';
import MonthlyWinners from '../components/home/MonthlyWinners';

const HomePage = () => {
    return (
        <div>
            <Hero/>
            {/* <SearchBar bgColor='#4048CD'/> */}
            <StatsSection/>
            
            <MonthlyWinners/>
            <Platform/>
            <Testimonials/>
        </div>
    );
};

export default HomePage;