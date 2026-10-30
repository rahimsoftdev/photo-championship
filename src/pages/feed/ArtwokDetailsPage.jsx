import { useLocation, useParams } from "react-router";
import useArtworkById from "../../hooks/useArtworkById";
import ArtworkImages from "../../components/ui/detailsPage/ArtworkImages";
// import ArtworkVideo from "../../components/ui/detailsPage/ArtworkVideo";
import ArtworkInfoSection from "../../components/ui/detailsPage/ArtworkInfoSection";
import ArtworkGalleryGrid from "../../components/ui/detailsPage/ArtworkGalleryGrid";
import ArtworkComments from "../../components/ui/detailsPage/ArtworkComments";
import SupportSection from "../../components/ui/detailsPage/SupportSection";
import LoadingPage from "../feedback/LoadingPage";
import GlobalRankings from "../../components/shared/Globalrankings";
import ArtworkVideo from "../../components/ui/detailsPage/ArtworkVideo";
import ArtworkDetailsSkeleton from "../../components/ui/Skeletons/ArtworkDetailsSkeleton";
// import ArtworkImages from "../../components/shared/ArtworkImages";

// user-dashboard ba admin dashboard route hole true
const DASHBOARD_PATH = /^\/(user-dashboard|admin-dashboard|admin)(\/|$)/;

const ArtwokDetailsPage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const isDashboard = DASHBOARD_PATH.test(pathname);

  const { artwork, loading, error } = useArtworkById(id, '/artWork.json');

  if (loading)return <ArtworkDetailsSkeleton/>

  if (error) {
    return <p>{error}</p>;
  }

  if (!artwork) {
    return <p>Artwork not found!</p>;
  }

  return (
    // Dashboard-e full width, public page-e ager moto max-w-main + center
    <main className={isDashboard ? "w-full" : "mx-auto w-full max-w-main px-4"}>

        {/* art work iamge carosel if 1 photo will show 1 photo if 6 or 12 will show carosel */}
      <ArtworkImages isDashboard={isDashboard} images={artwork.images} />
      <ArtworkGalleryGrid images={artwork.images} zodiacs={artwork.zodiacs} />

      {/* TODO: Video component  */}
      <ArtworkVideo video={artwork.video} />

      <ArtworkInfoSection isDashboard={isDashboard} artwork={artwork} />

      {
        !isDashboard && <SupportSection/>
      }

      <GlobalRankings/>
      
      <ArtworkComments isDashboard={isDashboard}  artwork={artwork} />


    </main>
  );
};

export default ArtwokDetailsPage;