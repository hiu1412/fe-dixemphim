import ArtistList from "@/components/artist/ArtistList";
import { Carousel } from "@/components/carousel";
import NewestProduct from "@/components/product/NewestProduct";
const carouselSlides = [
  {
    id: 1,
    imageUrl:
      "https://i.pinimg.com/736x/d1/51/f1/d151f1454bea00d37d2b5f7b653cb15c.jpg",
    title: "Âm nhạc luôn trong tim",
    description: "Âm nhạc kết nối mọi người lại với nhau",
  },
  {
    id: 2,
    imageUrl:
      "https://i.pinimg.com/736x/50/fa/ab/50faab807ed7a4765007fdb7a66f8afd.jpg",
    title: "Ô dé",
    description: "Đừng cứ mãi chìm đắm, có nhiều thứ ở hiện tại để nhớ",
  },
  {
    id: 3,
    imageUrl:
      "https://i.pinimg.com/736x/af/ed/ca/afedcadfcab0a85f7282b05880865bc2.jpg",
    title: "Ghé tiệm để mua nhé",
    description: "Chần chừ gì mà không mua",
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
      
      <section className="container mx-auto px-4 pt-6">
        <div className="rounded-xl overflow-hidden">
          < NewestProduct/>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-6">
        <div className="rounded-xl overflow-hidden">
          <ArtistList/>
        </div>
      </section>

    </div>
  );
}