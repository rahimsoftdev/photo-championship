import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/shared/Navbar';

//  
const MainLayout = () => {
    return (
        <div>
            <Navbar/>
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;