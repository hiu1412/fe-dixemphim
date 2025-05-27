"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import UsersPage from "@/components/user/UsersPage";
import { Skeleton } from "@/components/ui/skeleton";

// Loading Skeleton component
function UsersPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <div className="h-12 border-b px-4 flex items-center">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-24 mr-12" />
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 border-b px-4 flex items-center">
            {[...Array(5)].map((_, j) => (
              <Skeleton key={j} className="h-4 w-24 mr-12" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  
  // Lấy trang từ URL query params
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  
  return (
    <Suspense fallback={<UsersPageSkeleton />}>
      <UsersPage initialPage={page} />
    </Suspense>
  );
}