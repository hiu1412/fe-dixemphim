import { AllMovies } from "@/components/movies/AllMovie";

export default function MoviesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Danh sách phim</h1>
      <AllMovies />
    </div>
  );
}