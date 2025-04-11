import { create } from "zustand";
import { Movie } from "@/lib/api/types";

interface MovieStore {
  movies: Movie[] | null;
  selectedMovie: Movie | null;
  setMovies: (movies: Movie[]) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  addMovie: (movie: Movie) => void;
  updateMovie: (id: string, updatedMovie: Movie) => void;
  deleteMovie: (id: string) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  // State
  movies: null,
  selectedMovie: null,

  // Actions
  setMovies: (movies) => {
    set({ movies });
  },

  setSelectedMovie: (movie) => {
    set({ selectedMovie: movie });
  },

  addMovie: (movie) => {
    set((state) => ({
      movies: state.movies ? [...state.movies, movie] : [movie],
    }));
  },

  updateMovie: (id, updatedMovie) => {
    set((state) => ({
      movies: state.movies?.map((movie) => 
        movie.id === id ? updatedMovie : movie
      ) || null,
      selectedMovie: state.selectedMovie?.id === id ? updatedMovie : state.selectedMovie,
    }));
  },

  deleteMovie: (id) => {
    set((state) => ({
      movies: state.movies?.filter((movie) => movie.id !== id) || null,
      selectedMovie: state.selectedMovie?.id === id ? null : state.selectedMovie,
    }));
  },
}));