"use client";

import { useQuery } from "@tanstack/react-query";
import movieService from "@/lib/api/services/movie-service";
import Image from "next/image";

interface MovieDetailPageProps {
    params: {
        id: string;
    };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["movie", params.id],
        queryFn: () => movieService.getMovie(params.id),
    });

    const movie = data?.data;

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="container py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Không tìm thấy phim</h1>
                </div>
            </div>
        );
    }

    return (
        <main className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                {/* Poster */}
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                        src={movie.posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Thông tin */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

                    <div className="flex gap-4 text-gray-600 mb-6">
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        <span>{movie.duration} phút</span>
                        <span>Đạo diễn: {movie.director}</span>
                        <span>Đánh giá: {movie.rating}/10</span>
                    </div>

                    {movie.genre && movie.genre.length > 0 && (
                        <div className="flex gap-2 mb-6">
                            {movie.genre.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold mb-2">Nội dung phim</h2>
                        <p className="text-gray-600">{movie.description}</p>
                    </div>

                    {movie.showtime && movie.showtime.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-4">Lịch chiếu</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {movie.showtime.map((show) => (
                                    <div
                                        key={show.id}
                                        className="p-4 border rounded-lg"
                                    >
                                        <div className="font-medium">
                                            {new Date(show.startTime).toLocaleTimeString('vi-VN')}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Giá vé: {show.price.toLocaleString('vi-VN')}đ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 