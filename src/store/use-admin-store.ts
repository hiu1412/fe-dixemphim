import { create } from 'zustand';
import type { Movie } from '@/lib/api/types';

interface AdminState {
    movies: Movie[];
    totalMovies: number;
    selectedMovie: Movie | null;
    setMovies: (movies: Movie[], total: number) => void;
    setSelectedMovie: (movie: Movie | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    movies: [],
    totalMovies: 0,
    selectedMovie: null,
    setMovies: (movies, total) => set({ movies, totalMovies: total }),
    setSelectedMovie: (movie) => set({ selectedMovie: movie }),
}));