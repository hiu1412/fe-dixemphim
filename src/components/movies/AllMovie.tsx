"use client";

import { useAllMovies } from "@/hooks/queries/useAllMovies";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export const AllMovies = () => {
  const { data, isLoading } = useAllMovies({ page: 1 });

  useEffect(() => {
    if (data) {
      console.log("Movies data:", data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="w-full h-96" />
        ))}
      </div>
    );
  }

  // Truy cập vào mảng phim trong data
  const movies = data?.data?.data;

  // Kiểm tra nếu movies là một mảng trước khi gọi map
  if (!Array.isArray(movies)) {
    return <div>No movies available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {movies.map((movie: any) => (
        <Card key={movie._id} className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative" style={{ paddingTop: '130%' }}>
            <Image
              src={movie.poster || "/placeholder.jpg"}
              alt={movie.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-bold">{movie.title}</CardTitle>
            <Badge className="mt-2">{movie.rating}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 h-20 overflow-hidden">{movie.description}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              Đặt vé
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};