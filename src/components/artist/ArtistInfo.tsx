"use client";
import { useParams } from "next/navigation";
import { useArtistDetail } from "@/hooks/queries/artist/use-detail";

export default function ArtistInfo() {
  const { id } = useParams();
  const { data: artist, isLoading } = useArtistDetail(id as string);

  if (isLoading) return <div>Đang tải...</div>;
  if (!artist) return <div>Không tìm thấy nghệ sĩ</div>;

  return (
    <section className="bg-neutral-900 rounded-xl overflow-hidden mb-8">
      <h2 className="text-2xl font-bold text-white px-6 pt-6 pb-2">Giới thiệu</h2>
      <div className="relative">
          <img
    src={artist.image}
    alt={artist.name}
    className="w-64 h-48 object-cover"
  />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
          {/* Nếu có số người nghe/thông tin khác, bạn có thể thêm ở đây */}
          {/* <div className="font-bold text-lg text-white mb-2">1.739.534 người nghe hằng tháng</div> */}
          <div className="font-bold text-lg text-white mb-2">{artist.name}</div>
          <p className="text-white text-base max-w-2xl">{artist.description}</p>
        </div>
      </div>
    </section>
  );
}