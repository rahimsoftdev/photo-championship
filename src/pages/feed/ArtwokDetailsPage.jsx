import { useParams } from "react-router";
import useArtworkById from "../../hooks/useArtworkById";
import ArtworkImages from "../../components/ui/detailsPage/ArtworkImages";
import ArtworkVideo from "../../components/ui/detailsPage/ArtworkVideo";
import ArtworkInfoSection from "../../components/ui/detailsPage/ArtworkInfoSection";
import ArtworkGalleryGrid from "../../components/ui/detailsPage/ArtworkGalleryGrid";
// import ArtworkImages from "../../components/shared/ArtworkImages";

const ArtwokDetailsPage = () => {
  const { id } = useParams();

  const { artwork, loading, error } = useArtworkById(id);

  if (loading) {
    return <p>Loading artwork...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!artwork) {
    return <p>Artwork not found!</p>;
  }

  return (
    <main className="mx-auto w-full max-w-main px-4 py-6">

        {/* art work iamge carosel if 1 photo will show 1 photo if 6 or 12 will show carosel */}
      <ArtworkImages images={artwork.images} />
      <ArtworkGalleryGrid images={artwork.images} zodiacs={artwork.zodiacs} />

      {/* TODO: Video component  */}
      {/* <ArtworkVideo video={artwork.video} /> */}

      <ArtworkInfoSection artwork={artwork} />

  
    </main>
  );
};

export default ArtwokDetailsPage;
