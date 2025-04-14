import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dixemphim.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**", // Cho phép tất cả các đường dẫn
      },
    ], // Thêm domain của S3 vào đây
  },};

export default nextConfig;
