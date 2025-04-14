"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Movie } from "@/lib/api/types"; // assuming you've updated the type for Movie
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import { Loader2, MoreHorizontal, Plus, Search } from "lucide-react";
import Image from "next/image";
import { CreateMovieModal } from "@/components/movies/CreateMovieModal"; // assuming CreateMovieModal is updated
import { useDeleteMovie } from "@/hooks/mutations/useDeleteMovie"; // assuming useDeleteMovie hook is updated
import { EditMovieModal } from "@/components/movies/EditMovieModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

export default function MoviesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const deleteMovieMutation = useDeleteMovie();

  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["admin-movies", page, limit, search],
    queryFn: async () => {
      const response = await adminApi.getMovies();
      console.log("Movies API Response:", response);
      return response;
    },
  });

  const movies = moviesData?.data?.data;
  const pagination = moviesData?.data?.data;
  const total = pagination?.total || 0;
  const totalPages = pagination?.total_pages || 0;

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditModalOpen(true);
  };

  const handleDelete = (movie: Movie) => {
    setMovieToDelete(movie);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (movieToDelete) {
      deleteMovieMutation.mutate(movieToDelete.id);
      setDeleteModalOpen(false);
      setMovieToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý phim</h1>
          <p className="text-muted-foreground">Tổng số phim: {total}</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phim mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phim</CardTitle>
          <CardDescription>
            Quản lý tất cả các phim trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên phim..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Movies table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên phim</TableHead>
                    <TableHead>Đạo diễn</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
  {movies && movies.map((movie: Movie) => (
    <TableRow key={movie._id}>
      <TableCell>
        <div className="relative w-16 h-12 rounded-md overflow-hidden">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">{movie.title}</TableCell>
      <TableCell>{movie.director}</TableCell>
      <TableCell>{movie.duration} phút</TableCell>
      <TableCell>{movie.rating}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(movie)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => handleDelete(movie)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages}
                  </div>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => {
                      setLimit(Number(value));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ITEMS_PER_PAGE_OPTIONS.map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          {value} mục / trang
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination?.has_prev_page}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination?.has_next_page}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateMovieModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      {selectedMovie && (
        <EditMovieModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          movie={selectedMovie}
        />
      )}

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phim</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phim {movieToDelete?.title}? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
