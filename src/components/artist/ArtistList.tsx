"use client";
import { useArtist } from "@/hooks/queries/artist/use-list";
import Link from "next/link";

export default function ArtistList() {
    const { data, isLoading, error } = useArtist();

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {(error as Error).message}</div>;

    return (
        <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Nghệ sĩ phổ biến</h2>
                <a href="/artist" className="text-sm text-gray-400 hover:text-primary font-semibold">Hiện tất cả</a>
            </div>
            <div className="flex gap-8 overflow-x-auto pb-2">
                {data?.map((artist) => (
                    <Link
                        key={artist._id}
                        href={`/artist/${artist._id}`}
                        className="min-w-[120px]"
                    >
                        <div
                            className="group flex flex-col items-center rounded-xl bg-neutral-900 dark:bg-neutral-800 shadow-lg transition duration-300
                            hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80"
                        >
                            <div className="w-28 h-28 rounded-full overflow-hidden mb-3 mt-4 shadow-lg bg-neutral-800">
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="font-semibold text-base text-gray-100 text-center truncate max-w-[110px]">{artist.name}</div>
                            <div className="text-xs text-gray-400 text-center mb-4">Nghệ sĩ</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}