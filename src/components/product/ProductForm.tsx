"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/api/types";
import { useArtist } from "@/hooks/queries/artist/use-list";
import { useGenres } from "@/hooks/queries/genre/use-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Artist, Genre } from "@/lib/api/types";
import Image from "next/image";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(initialData?.image);
  const { data: artists = [] } = useArtist();
  const { data: genres = [] } = useGenres();

  // Log ra để debug
  console.log('Artists:', artists);
  console.log('Genres:', genres);

  const [selectedArtists, setSelectedArtists] = useState<string[]>(
    initialData?.artists.map((artist) => (typeof artist === "string" ? artist : artist._id)) || []
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialData?.genres || []
  );

  const artistOptions = artists.map((artist: Artist) => ({
    value: artist._id,
    label: artist.name,
  }));

  const genreOptions = genres.map((genre: Genre) => ({
    value: genre._id,
    label: genre.name,
  }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Thêm artists và genres vào formData
    selectedArtists.forEach((artistId) => {
      formData.append("artists[]", artistId);
    });

    selectedGenres.forEach((genreId) => {
      formData.append("genres[]", genreId);
    });

    onSubmit(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Tên sản phẩm</Label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          required
          placeholder="Nhập tên sản phẩm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Giá</Label>
        <Input
          id="price"
          name="price"
          type="number"
          defaultValue={initialData?.price}
          required
          min="0"
          placeholder="Nhập giá sản phẩm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Số lượng</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          defaultValue={initialData?.quantity}
          required
          min="0"
          placeholder="Nhập số lượng"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description}
          required
          placeholder="Nhập mô tả sản phẩm"
        />
      </div>

      <div className="space-y-2">
        <Label>Nghệ sĩ</Label>
        <MultiSelect
          options={artistOptions}
          value={selectedArtists}
          onChange={setSelectedArtists}
          placeholder="Chọn nghệ sĩ..."
        />
      </div>

      <div className="space-y-2">
        <Label>Thể loại</Label>
        <MultiSelect
          options={genreOptions}
          value={selectedGenres}
          onChange={setSelectedGenres}
          placeholder="Chọn thể loại..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Hình ảnh</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm mới"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    </form>
  );
}