import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import {toast} from "sonner";
import {Movie} from "@/lib/api/types";
import {useAdminStore} from "@/store/use-admin-store";


interface CreateMovieInput{
    title: string;
    description: string;
    duration: number;
    poster: string;
    director: string;
    rating: number;
}
export const useCreateMovie = () => {
    const queryClient = useQueryClient();
    const { movies, totalMovies, setMovies } = useAdminStore();

    return useMutation({
        mutationFn: async (input: CreateMovieInput) => {
            const formData = new FormData();
            formData.append("title", input.title);
            formData.append("description", input.description);
            formData.append("duration", input.duration.toString());
            formData.append("poster", input.poster);
            formData.append("director", input.director);
            formData.append("rating", input.rating.toString());
            const response = await adminApi.createMovie(formData);
            
            return response.data;
        },
        onSuccess: (data) => {
            const newMovie = data.movie as Movie; // Truy cập đúng thuộc tính movie
            setMovies([newMovie, ...movies], totalMovies + 1);
            queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
            toast.success(data.message || 'Phim đã được thêm thành công');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm phim mới');
        },
    });
}