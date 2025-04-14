import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMovie } from "@/hooks/mutations/useUpdateMovie";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Movie } from "@/lib/api/types";
import { Loader2 } from "lucide-react";

const editMovieSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên phim"),
  description: z.string().min(1, "Vui lòng nhập mô tả phim"),
  duration: z
    .string()
    .regex(/^\d+$/, "Thời gian phải là số")
    .transform(Number)
    .refine((n) => n > 0, "Thời gian không hợp lệ"),
  poster: z.string().optional(),
  director: z.string().min(1, "Vui lòng nhập tên đạo diễn"),
  rating: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Đánh giá phải là số (tối đa 2 chữ số thập phân)")
    .transform(Number)
    .refine((n) => n >= 0 && n <= 10, "Đánh giá phải trong khoảng từ 0 đến 10"),
});

type EditMovieForm = z.infer<typeof editMovieSchema>;

interface EditMovieModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movie: Movie;
}

export function EditMovieModal({ open, onOpenChange, movie }: EditMovieModalProps) {
  const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const form = useForm<EditMovieForm>({
    resolver: zodResolver(editMovieSchema),
    defaultValues: {
      title: movie.title,
      description: movie.description,
      duration: movie.duration.toString(),
      poster: movie.poster,
      director: movie.director,
      rating: movie.rating.toString(),
    },
  });

  // Reset form khi movie thay đổi
  useEffect(() => {
    form.reset({
      title: movie.title,
      description: movie.description,
      duration: movie.duration.toString(),
      poster: movie.poster,
      director: movie.director,
      rating: movie.rating.toString(),
    });
    setPosterPreview(movie.poster);
  }, [movie, form]);

  const updateMovie = useUpdateMovie();

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: EditMovieForm) => {
    updateMovie.mutate(
      {
        id: movie.id,
        ...data,
        duration: parseInt(data.duration),
        rating: parseFloat(data.rating),
        poster: selectedPoster,
      },
      {
        onSuccess: () => {
          setSelectedPoster(null);
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phim</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin phim {movie.title}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phim</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên phim" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input placeholder="Mô tả phim" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian (phút)</FormLabel>
                  <FormControl>
                    <Input placeholder="120" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="director"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đạo diễn</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên đạo diễn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá</FormLabel>
                  <FormControl>
                    <Input placeholder="9.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Poster</FormLabel>
              <FormControl>
                <div className="grid gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                  />
                  {posterPreview && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={posterPreview}
                        alt="Preview"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateMovie.isPending}>
                {updateMovie.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}