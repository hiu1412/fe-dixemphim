import { create } from "zustand";
import { Movie } from "@/lib/api/types";

interface MovieStore {
  // States
  movies: Movie[];
  newestMovies: Movie[];
  selectedMovie: Movie | null;
  
  // Actions
  setMovies: (movies: Movie[]) => void;
  setNewestMovies: (movies: Movie[]) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  clearMovies: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  // Initial states
  movies: [],
  newestMovies: [],
  selectedMovie: null,

  // Actions
  setMovies: (movies) => set({ movies }),
  setNewestMovies: (movies) => set({ newestMovies: movies }),
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  clearMovies: () => set({ movies: [], newestMovies: [], selectedMovie: null }),
}));