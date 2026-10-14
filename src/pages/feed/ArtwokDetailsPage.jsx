import { useParams } from "react-router";
import useArtworkById from "../../hooks/useArtworkById";

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
    <div>
      <h1>{artwork.title}</h1>

      <p>{artwork.description}</p>

      <img
        src={artwork.images[0]}
        alt={artwork.title}
      />

      <p>Author: {artwork.info.author}</p>

      <p>Category: {artwork.category}</p>

      <p>Views: {artwork.viewsCount}</p>

      <p>Reactions: {artwork.totalReact}</p>
    </div>
  );
};

export default ArtwokDetailsPage;
