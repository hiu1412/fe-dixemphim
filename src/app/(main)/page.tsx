import { Carousel } from "@/components/carousel";
const carouselSlides = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2050",
    title: "Trải nghiệm Điện ảnh Tuyệt vời",
    description: "Thưởng thức những bộ phim mới nhất với chất lượng cao nhất",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070",
    title: "Ưu đãi Đặc biệt",
    description: "Giảm giá cho thành viên mới và các suất chiếu sớm",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=2070",
    title: "Trải nghiệm Thoải mái",
    description: "Hệ thống rạp hiện đại với ghế ngồi êm ái",
  },
];
export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section with Carousel */}
      <section className="container mx-auto px-4 pt-6">
        <div className="rounded-xl overflow-hidden">
          <Carousel slides={carouselSlides} />
        </div>
      </section>
    </div>
  );
}