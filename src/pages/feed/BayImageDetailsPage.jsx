import React from 'react';
import { useParams } from 'react-router';
import useArtworkById from '../../hooks/useArtworkById';
import ArtworkImages from '../../components/ui/detailsPage/ArtworkImages';
import ArtworkGalleryGrid from '../../components/ui/detailsPage/ArtworkGalleryGrid';
import BayPhotoGalleryGrid from '../../components/ui/detailsPage/BayPhotoGalleryGrid';

const BayImageDetailsPage = () => {

    const { id } = useParams();

    const { artwork: bayPhoto, loading, error } = useArtworkById(id, '/bayPhoto.json');
    console.log(bayPhoto)
    return (
        <div className='max-w-main mx-auto'>

            {/* art work iamge carosel if 1 photo will show 1 photo if 6 or 12 will show carosel */}
            <ArtworkImages images={bayPhoto?.images} />
            <ArtworkGalleryGrid images={bayPhoto?.images} zodiacs={bayPhoto?.zodiacs} />

            {/* TODO: Video component  */}
            {/* <ArtworkVideo video={artwork.video} /> */}

            <BayPhotoGalleryGrid images={bayPhoto?.images} zodiacs={bayPhoto?.zodiacs} bayPhoto={bayPhoto} />

        </div>
    );
};

export default BayImageDetailsPage;