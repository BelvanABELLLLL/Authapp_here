import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",        // URL asal
        destination: "/login", // tujuan redirect
        permanent: false,   // false = redirect sementara
      },
    ];
  },
};

export default nextConfig;
