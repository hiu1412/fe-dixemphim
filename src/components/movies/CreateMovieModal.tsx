import { useState } from "react";
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
import { adminApi } from "@/lib/api/admin";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCreateMovie } from "@/hooks/mutations/useCreateMovie"
;

const createMovieSchema = z.object({
    title: z.string().min(1, "Vui lòng nhập tên phim"),
    description: z.string().min(1, "Vui lòng nhập mô tả phim"),
    duration: z
      .number({
        required_error: "Vui lòng nhập thời lượng phim",
        invalid_type_error: "Thời lượng phải là số",
      })
      .min(1, "Thời lượng phải lớn hơn 0"),
    director: z.string().min(1, "Vui lòng nhập tên đạo diễn"),
    rating: z
      .number({
        required_error: "Vui lòng nhập đánh giá phim",
        invalid_type_error: "Đánh giá phải là số",
      })
      .min(0, "Đánh giá không được âm")
      .max(10, "Đánh giá không được quá 10"),
    // Không bao gồm showtime
  });

  type CreateMovieForm = z.infer<typeof createMovieSchema>;

  interface CreateMovieModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }


  export function CreateMovieModal({ open, onOpenChange }: CreateMovieModalProps) {
    const [selectedPoster, setSelectedPoster] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
  
    const form = useForm<CreateMovieForm>({
      resolver: zodResolver(createMovieSchema),
    });
  
    const createMovie = useCreateMovie();
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedPoster(file);
        setPosterPreview(URL.createObjectURL(file));
      }
    };
  
    const onSubmit = (data: CreateMovieForm) => {
      if (!selectedPoster) {
        form.setError("poster", {
          message: "Vui lòng chọn ảnh poster",
        });
        return;
      }
  
      createMovie.mutate(
        {
          ...data,
          poster: selectedPoster,
        },
        {
          onSuccess: () => {
            form.reset();
            setSelectedPoster(null);
            setPosterPreview(null);
            onOpenChange(false);
          },
        }
      );
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm phim mới</DialogTitle>
            <DialogDescription>Điền thông tin phim vào form bên dưới</DialogDescription>
          </DialogHeader>
  
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên phim</FormLabel>
                    <FormControl><Input placeholder="Avengers: Endgame" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="Một trận chiến sinh tử..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời lượng (phút)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="120"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
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
                      <FormLabel>Điểm đánh giá</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="8.5"
                          step="0.1"
                          value={field.value}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
  
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đạo diễn</FormLabel>
                    <FormControl><Input placeholder="Christopher Nolan" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="poster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster</FormLabel>
                    <FormControl>
                      <div className="grid gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {posterPreview && (
                          <div className="relative aspect-video rounded-lg overflow-hidden">
                            <img src={posterPreview} alt="Preview" className="object-cover" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                <Button type="submit" disabled={createMovie.isPending || !selectedPoster}>
                  {createMovie.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Thêm phim
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }