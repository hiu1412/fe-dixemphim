import { Carousel } from "@/components/carousel";

const carouselSlides = [
    {
        id: 1,
        imageUrl:
            "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/07/Titanic-Leonardo-dicaprio-jack-did-not-love-Rose.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5",
        title: "Titanic",
        description: "Ngoài kia bao la sóng gió đừng quên anh",
    },
    {
        id: 2,
        imageUrl:
            "https://icdn.24h.com.vn/upload/2-2022/images/2022-06-22/megu-fujiura--2--1655859994-80-width660height895.jpg",
        title: "Đệ nhất ngực đẹp",
        description: "Người phụ nữ vú to nhưng luôn buồn",
    },
    {
        id: 3,
        imageUrl:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
        title: "Dịch vụ hậu mãi tận tâm",
        description: "Chăm sóc xe của bạn với đội ngũ chuyên nghiệp",
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
