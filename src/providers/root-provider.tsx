"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";//thong bao 

export default function RootProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 phút
            gcTime: 10 * 60 * 1000, // 10 phút
            retry: false, // Không tự động retry khi lỗi
            refetchOnWindowFocus: false, // Không fetch lại khi focus vào cửa sổ
            refetchOnMount: false, // Không fetch lại khi mount component
          },
        },
      })
  );

  //doi sang toi
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        {children}
        <Toaster position="top-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
