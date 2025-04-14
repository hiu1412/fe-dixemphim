import create from 'zustand';

interface MovieStore {
    selectedMovieId: string | null;
    setSelectedMovieId: (id: string) => void;
    selectedShowtimeId: string | null;
    setSelectedShowtimeId: (id: string) => void;
    selectedSeats: string[];
    setSelectedSeats: (seats: string[]) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
    selectedMovieId: null,
    setSelectedMovieId: (id) => set({ selectedMovieId: id }),
    selectedShowtimeId: null,
    setSelectedShowtimeId: (id) => set({ selectedShowtimeId: id }),
    selectedSeats: [],
    setSelectedSeats: (seats) => set({ selectedSeats: seats }),
})); 