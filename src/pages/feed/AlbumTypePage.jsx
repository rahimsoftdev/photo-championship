import React from 'react';
import AlbumTypes from '../../components/shared/AlbumTypes';
import HowItWorks from '../../components/shared/HowItWorks';

const AlbumTypePage = () => {
    return (
        <div className=''>
            <AlbumTypes  />
            <HowItWorks pb={true} />
        </div>
    );
};

export default AlbumTypePage;