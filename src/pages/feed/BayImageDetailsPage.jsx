import React from 'react';
import { useLocation, useParams } from 'react-router';
import useArtworkById from '../../hooks/useArtworkById';
import ArtworkImages from '../../components/ui/detailsPage/ArtworkImages';
import ArtworkGalleryGrid from '../../components/ui/detailsPage/ArtworkGalleryGrid';
import BayPhotoGalleryGrid from '../../components/ui/detailsPage/BayPhotoGalleryGrid';
import ArtworkVideo from '../../components/ui/detailsPage/ArtworkVideo';

// user-dashboard ba admin dashboard route hole true
const DASHBOARD_PATH = /^\/(user-dashboard|admin-dashboard|admin)(\/|$)/;

const BayImageDetailsPage = () => {

    const { id } = useParams();
    const { pathname } = useLocation();
    const isDashboard = DASHBOARD_PATH.test(pathname);

    const { artwork: bayPhoto, loading, error } = useArtworkById(id, '/bayPhoto.json');
    console.log(bayPhoto)
    return (
        // Dashboard-e full width, public page-e ager moto max-w-main + center
        <div className={isDashboard ? 'w-full' : 'max-w-main mx-auto px-5'}>

            {/* art work iamge carosel if 1 photo will show 1 photo if 6 or 12 will show carosel */}
            <ArtworkImages isDashboard={isDashboard} images={bayPhoto?.images} />
            <ArtworkGalleryGrid images={bayPhoto?.images} zodiacs={bayPhoto?.zodiacs} />

            {/* TODO: Video component  */}
            <ArtworkVideo  />

            <BayPhotoGalleryGrid images={bayPhoto?.images} zodiacs={bayPhoto?.zodiacs} bayPhoto={bayPhoto} />

        </div>
    );
};

export default BayImageDetailsPage;