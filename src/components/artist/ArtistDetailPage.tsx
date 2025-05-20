import ArtistInfo from './ArtistInfo';
import ArtistProducts from './ArtistProducts';

export default function ArtistDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ArtistInfo />
      <ArtistProducts />
    </div>
  );
}