"use client";

import { useNewestMovies } from "@/hooks/queries/useNewestMovies";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const NewestMovies = () => {
//   const { data, isLoading, error } = useNewestMovies();
//   const { newestMovies, setSelectedMovie } = useMovieStore();

//   // Debug logs
//   console.log("NewestMovies Component State:", {
//     isLoading,
//     error,
//     data,
//     newestMoviesFromStore: newestMovies,
//   });

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {[1, 2, 3].map((i) => (
//           <Card key={i} className="w-full">
//             <div className="rounded-t-lg h-48 w-full">
//               <Skeleton className="h-full w-full rounded-t-lg" />
//             </div>
//             <CardHeader>
//               <Skeleton className="h-4 w-3/4" />
//               <Skeleton className="h-4 w-1/2" />
//             </CardHeader>
//             <CardContent>
//               <Skeleton className="h-8 w-full" />
//             </CardContent>
//             <CardFooter>
//               <Skeleton className="h-8 w-full" />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu</p>
//         <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
//       </div>
//     );
//   }

//   if (!newestMovies || newestMovies.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-muted-foreground">Không có phim mới nào</p>
//         {data && (
//           <pre className="text-xs mt-4 p-4 bg-muted rounded-lg overflow-auto">
//             {JSON.stringify(data, null, 2)}
//           </pre>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {movies.map((movie: any) => (
//         <Card key={movie._id} className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
//           <div className="relative" style={{ paddingTop: '130%' }}>
//             <Image
//               src={movie.poster || "/placeholder.jpg"}
//               alt={movie.title}
//               fill
//               className="object-cover rounded-t-lg"
//             />
//           </div>
//           <CardHeader>
//             <CardTitle className="text-lg font-bold">{movie.title}</CardTitle>
//             <Badge className="mt-2">{movie.rating}</Badge>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-gray-600 h-20 overflow-hidden">{movie.description}</p>
//           </CardContent>
//           <CardFooter>
//             <Button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
//               Đặt vé
//             </Button>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// };
}